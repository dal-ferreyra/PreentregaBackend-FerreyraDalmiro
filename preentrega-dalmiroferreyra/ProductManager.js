import fs from "fs";


class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id = 0;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}


class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(this.path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
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
            return;
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

            console.log("Se agrego el producto correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        if (isNaN(Number(idProduct))) {
            console.log("El id debe ser un número");
            return;
        }

        const product = this.products.find(
            (product) => product.id === Number(idProduct)
        );

        if (!product) {
            return "No se encontro el producto";
        }

        return product;
    }

    deleteProduct(idProduct) {
        const productIndex = this.products.findIndex(
            (product) => product.id === idProduct
        );

        if (productIndex === -1) {
            console.log("No se encontro el producto");
            return;
        }

        this.products.splice(productIndex, 1);

        try {
            fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            );

            console.log("Se elimino el producto correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    updateProduct(idProduct, product) {
        const productIndex = this.products.findIndex(
            (product) => product.id === idProduct
        );

        const productOld = this.products[productIndex];

        if (productIndex === -1) {
            console.log("No se encontro el producto");
            return;
        }

        this.products[productIndex] = {
            ...productOld,
            ...product,
        };

        try {
            fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            );

            console.log("Se actualizo el producto correctamente");
        } catch (error) {
            console.log(error);
        }
    }
}

// module.exports = new ProductManager("./data/products.json");
export default new ProductManager("./data/products.json");
