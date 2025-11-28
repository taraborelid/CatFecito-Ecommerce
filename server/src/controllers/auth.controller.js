import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { signAccessToken } from "../libs/jwt.js";
import crypto from "crypto";

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "name, email y password son requeridos" });

  try {
    const exists = await pool.query(
      "SELECT 1 FROM users WHERE lower(email) = lower($1)",
      [email]
    );
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, is_active, created_at, updated_at`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = await signAccessToken({ id: user.id, role: user.role });

    return res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email y password son requeridos",
    });
  }

  try {
    // Buscar usuario por email
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role, is_active, last_login_at, created_at 
       FROM users 
       WHERE lower(email) = lower($1)`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(403).json({
        message: "Cuenta desactivada. Contacta al administrador",
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Actualizar last_login_at
    await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [
      user.id,
    ]);

    // Generar token JWT
    const token = await signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // Preparar datos del usuario (sin password_hash)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      last_login_at: new Date().toISOString(),
      created_at: user.created_at,
    };

    return res.status(200).json({
      success: true,
      message: `Bienvenido ${user.role === "admin" ? "Administrador" : ""} ${
        user.name
      }`,
      user: userData,
      token,
      permissions: {
        isAdmin: user.role === "admin",
        canManageUsers: user.role === "admin",
        canManageProducts: user.role === "admin",
        canViewOrders: true,
        canManageOrders: user.role === "admin",
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

export async function logout(req, res) {
  try {
    // Opcional: Registrar la hora de logout
    if (req.user?.id) {
      await pool.query(`UPDATE users SET updated_at = NOW() WHERE id = $1`, [
        req.user.id,
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({
      message: "Error al cerrar sesión",
    });
  }
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requerido" });
  }

  try {
    const userRes = await pool.query(
      "SELECT id, email, name FROM users WHERE lower(email) = lower($1)",
      [email]
    );

    // Respuesta genérica para evitar enumeración de usuarios
    if (userRes.rowCount === 0) {
      return res.json({
        success: true,
        message: "Si el email existe, recibirás un código de recuperación.",
      });
    }

    const user = userRes.rows[0];
    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Invalidar códigos anteriores del usuario
    await pool.query(
      "UPDATE password_reset_codes SET used = true WHERE user_id = $1 AND used = false",
      [user.id]
    );

    // Crear nuevo código
    await pool.query(
      "INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES ($1, $2, $3)",
      [user.id, code, expiresAt]
    );

    // Notificar n8n (fire-and-forget) - PAYLOAD CORREGIDO
    const N8N_URL = process.env.N8N_WEBHOOK_URL_PASSWORD_RESET;
    if (N8N_URL) {
      fetch(N8N_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          code,
        }),
      })
        .then((r) => {
          if (!r.ok) {
            console.warn(
              `n8n respondió ${r.status} al enviar código de recuperación`
            );
          } else {
            console.log(`Email de recuperación enviado a ${user.email}`);
          }
        })
        .catch((err) => console.warn("Error notificando n8n:", err.message));
    } else {
      console.warn("N8N_WEBHOOK_URL_PASSWORD_RESET no está configurado");
    }

    return res.json({
      success: true,
      message: "Si el email existe, recibirás un código de recuperación.",
    });
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function resetPassword(req, res) {
  const { code, newPassword } = req.body;

  if (!code || !newPassword) {
    return res.status(400).json({
      message: "Código y nueva contraseña requeridos",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  try {
    const codeRes = await pool.query(
      `SELECT id, user_id FROM password_reset_codes 
       WHERE upper(code) = upper($1) AND used = false AND expires_at > NOW()`,
      [code]
    );

    if (codeRes.rowCount === 0) {
      return res.status(400).json({
        message: "Código inválido o expirado",
      });
    }

    const { id: resetId, user_id } = codeRes.rows[0];

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña y marcar código como usado
    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [passwordHash, user_id]
    );

    await pool.query(
      "UPDATE password_reset_codes SET used = true WHERE id = $1",
      [resetId]
    );

    return res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
