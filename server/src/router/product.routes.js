import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadProductImage } from '../middlewares/upload.js';
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, toggleProductStatus } from '../controllers/product.controller.js';

const router = Router();

router.get("/", getAllProducts);
// Mover la ruta de categoría antes de la ruta por id evita conflictos ("/category/:id" <- vs -> ":id")
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);

// SOLO ADMIN
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  uploadProductImage.single('image'),
  createProduct
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  uploadProductImage.single('image'),
  updateProduct
);
router.patch("/:id/status", verifyToken, verifyAdmin, toggleProductStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
