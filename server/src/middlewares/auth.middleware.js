import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const verifyToken = async (req, res, next) => {
  try {
    // CAMBIO: Ya no buscamos en headers, buscamos en la cookie
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({
        message: "No autorizado (Sesión no encontrada)",
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    // Si el token es inválido, forzamos el borrado de la cookie
    res.clearCookie('token');

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "La sesión ha expirado" });
    }

    return res.status(401).json({ message: "Sesión inválida" });
  }
};

// Middleware adicional para verificar si es admin
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado. Se requieren permisos de administrador",
    });
  }
  next();
};
