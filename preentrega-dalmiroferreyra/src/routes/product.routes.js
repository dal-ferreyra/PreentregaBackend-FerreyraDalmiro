import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";
import Product from "../classes/Product.js";

const router = Router();

router.get("/", (req, res) => {
    res.json(productManager.getProducts());
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productManager.getProductById(Number(id));
        if (!product) {
            return res.status(404).json({ error: "No se encontró el producto" });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: `No se pudo obtener el producto: ${error}` });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const product = new Product(title, description, price, thumbnail, code, stock);

    try {
        await productManager.addProduct(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: `No se pudo agregar el producto: ${error}` });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock, status } = req.body;

    try {
        const product = await productManager.getProductById(Number(id));
        if (!product) {
            return res.status(404).json({ error: "No se encontró el producto" });
        }

        await productManager.updateProduct(id, {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
        });

        const newProduct = await productManager.getProductById(Number(id));
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo actualizar el producto: ${error}` });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productManager.getProductById(Number(id));
        if (!product) {
            return res.status(404).json({ error: "No se encontró el producto" });
        }

        await productManager.deleteProduct(Number(id));
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: `No se pudo eliminar el producto: ${error}` });
    }
});

export default router;