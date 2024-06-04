import express from "express";
import ProductManager from "./managers/ProductManager.js";

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
    res.send("<h1> Bienvenido a mi API </h1>");
});

// Endpoint - Ruta - Url
app.get("/products", (req, res) => {
    res.json(ProductManager.getProducts());
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    const product = ProductManager.getProductById(id);

    if (!product) {
        return res.status(404).json({
            error: "No se encontro el producto",
        });
    }
    res.json(product);
});

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});