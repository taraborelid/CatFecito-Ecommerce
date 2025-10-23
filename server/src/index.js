import "dotenv/config";
import app from "./app.js";
import { testDB } from "./db.js";
import cron from "node-cron";
import { cancelUnpaidOrders } from "./jobs/cancelUnpaidOrders.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testDB();

    app.listen(PORT, () => {
      console.log("🚀 Servidor iniciado correctamente");
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🔗 URL Local: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🐱 ¡Catfecito Backend está funcionando! ☕");
      
      // Cron job: Cancelar órdenes no pagadas cada 5 minutos
      cron.schedule('*/5 * * * *', () => {
        console.log("⏰ Ejecutando job: Cancelar órdenes no pagadas...");
        cancelUnpaidOrders();
      });
      
      console.log("⏰ Cron job iniciado: Cancelación de órdenes no pagadas cada 5 minutos");
    });
  } catch (error) {
    console.error("Error al iniciar el servidor", error);
    process.exit(1);
  }
}

startServer();
