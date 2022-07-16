import { v1 as uuid } from "uuid";
import * as Product from "../models/Product.js";

export const getAllProducts = (req, res) => {
    Product.find()
        .then((products) => {
            const mappedProducts = products.map((product) => {
                const host = req.get("host");
                product.imageUrl = `${req.protocol}://${host}/images/${product.imageUrl}`;

                return product;
            });
            res.status(200).json(mappedProducts);
        })
        .catch(() => {
            res.status(500).send(new Error("Database error!"));
        });
};

export const getOneProduct = (req, res) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).send(new Error("Product not found!"));
            }

            const host = req.get("host");
            product.imageUrl = `${req.protocol}://${host}/images/${product.imageUrl}`;

            res.status(200).json(product);
        })
        .catch(() => {
            res.status(500).send(new Error("Database error!"));
        });
};

export const orderProducts = (req, res) => {
    if (
        !req.body.contact ||
        !req.body.contact.firstName ||
        !req.body.contact.lastName ||
        !req.body.contact.address ||
        !req.body.contact.city ||
        !req.body.contact.email ||
        !req.body.products
    ) {
        return res.status(400).send(new Error("Bad request!"));
    }

    const queries = [];
    for (const productId of req.body.products) {
        const queryPromise = new Promise((resolve, reject) => {
            Product.findById(productId)
                .then((product) => {
                    if (!product) {
                        reject("Product not found: " + productId);
                    }

                    const host = req.get("host");
                    product.imageUrl = `${req.protocol}://${host}/images/${product.imageUrl}`;

                    resolve(product);
                })
                .catch(() => {
                    reject("Database error!");
                });
        });
        queries.push(queryPromise);
    }

    Promise.all(queries)
        .then((products) => {
            const orderId = uuid();
            return res.status(201).json({
                contact: req.body.contact,
                products: products,
                orderId: orderId,
            });
        })
        .catch((error) => {
            return res.status(500).json(new Error(error));
        });
};
