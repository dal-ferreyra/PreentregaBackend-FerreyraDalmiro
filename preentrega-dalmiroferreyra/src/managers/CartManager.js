import { productManager } from "./ProductManager.js";
import Cart from "../classes/Cart.js";
import __dirname from "../dirname.js";
import fs from "fs/promises";
import path from "path";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = this.loadCartsSync();
    }

    loadCartsSync() {
        try {
            const data = fs.readFileSync(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        const latestId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = new Cart(latestId);
        this.carts.push(newCart);

        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
            console.log("Se creo el carrito correctamente");
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCart(idCart) {
        if (isNaN(Number(idCart))) {
            throw new Error("El id debe ser un número");
        }

        const cart = this.carts.find((cart) => cart.id === Number(idCart));
        if (!cart) {
            throw new Error("No se encontró el carrito");
        }

        return cart;
    }

    async addProductToCart(idCart, idProduct) {
        const cart = await this.getCart(idCart);
        const product = await productManager.getProductById(idProduct);

        if (!product) {
            throw new Error("No se encontró el producto");
        }

        const productInCart = cart.products.find((product) => product.productId === idProduct);
        if (productInCart) {
            cart.products.forEach((product) => {
                if (product.productId === idProduct) {
                    product.quantity += 1;
                }
            });
        } else {
            cart.products.push({ productId: idProduct, quantity: 1 });
        }

        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
            console.log("Se agregó el producto correctamente");
        } catch (error) {
            throw new Error(error);
        }
    }
}

const cartManager = new CartManager(path.resolve(__dirname, "./data/carts.json"));
export default cartManager;