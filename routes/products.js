import express from "express";
import { createProduct, getAllProducts } from "../controllers/products.js";

const router = express.Router();

router.route("/")
    .post(createProduct)
    .get(getAllProducts);

export default router;
