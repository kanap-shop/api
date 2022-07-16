import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/product.js";

const app = express();

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static("images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRoutes);

export default app;
