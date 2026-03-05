import { Router } from "express";
import {
  createProducts,
  getAllCustomers,
  getAllOrders,
  getDashboardStats,
  getProducts,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admin.controller.js";
import { adminOnly, protectedRoute } from "../middleware/auth.middleware.js";

import { get } from "http";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
//we can have bunch of API routes here related to admin

//optimization : Do not repeat yourself
router.use(protectedRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProducts);
router.get("/products", getProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);

//endpoints releated to orders. Admin should be able to get all the orders to show in the dashborad and update
//any specific order's status from pending -> shipped -> delivered with its orderId given which is dynamic

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

//put: updating the entire resource
//patch:updating only specific parts  of the resource

//enpoints related to the customer and stats

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

export default router;
