import { Router } from "express";

import {
    getAllProducts,
    getOneProduct,
    orderProducts,
} from "../controllers/product.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/order", orderProducts);

export default router;
