import fs from "fs";
import __dirname from "../dirname.js";
import path from "path";

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = this.loadProductsSync();
    }

    loadProductsSync() {
        try {
            const data = fs.readFileSync(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            console.log("Todos los campos son obligatorios");
            throw new Error("Todos los campos son obligatorios");
        }

        if (this.products.some((p) => p.code === product.code)) {
            console.log("El código ya existe");
            throw new Error("El código ya existe");
        }

        if (this.products.length > 0) {
            const newId = this.products[this.products.length - 1].id + 1;
            product.id = newId;
        } else {
            product.id = 1;
        }

        this.products.push(product);

        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            );
            console.log("Se agregó el producto correctamente");
        } catch (error) {
            throw new Error(error);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        if (isNaN(Number(idProduct))) {
            console.log("El id debe ser un número");
            throw new Error("El id debe ser un número");
        }

        const product = this.products.find((product) => product.id === Number(idProduct));
        if (!product) {
            throw new Error("No se encontró el producto");
        }

        return product;
    }

    async deleteProduct(idProduct) {
        const productIndex = this.products.findIndex((product) => product.id === idProduct);
        if (productIndex === -1) {
            throw new Error("No se encontró el producto");
        }

        this.products.splice(productIndex, 1);

        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            );
            console.log("Se eliminó el producto correctamente");
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(idProduct, product) {
        const productIndex = this.products.findIndex((product) => product.id === Number(idProduct));
        if (productIndex === -1) {
            throw new Error("No se encontró el producto");
        }

        const newProduct = {
            id: Number(idProduct),
            title: product.title || this.products[productIndex].title,
            description: product.description || this.products[productIndex].description,
            price: product.price || this.products[productIndex].price,
            thumbnail: product.thumbnail || this.products[productIndex].thumbnail,
            code: product.code || this.products[productIndex].code,
            stock: product.stock || this.products[productIndex].stock,
            status: product.status ?? this.products[productIndex].status,
        };

        this.products[productIndex] = newProduct;

        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            );
            console.log("Se actualizó el producto correctamente");
        } catch (error) {
            throw new Error(error);
        }
    }
}

const productManager = new ProductManager(
    path.resolve(__dirname, "./data/products.json")
);

export default productManager;