import { Product, Products, UnitProduct } from "./product.interface";
import {v4 as random} from "uuid";
//import fs from "fs";
import mysql from "mysql"

const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "", 
    database: "canazaresdb", 
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      return;
    }
    console.log("Connected to MySQL database.");
  });

  function executeQuery(query: string, values: any): Promise<any> {
    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

export const findAll = async (): Promise<UnitProduct[]> => {
    const query = "SELECT * FROM products";
    const products = await executeQuery(query, []);
    return products;
};

export const findOne = async (id: string): Promise<UnitProduct | null> => {
    const query = "SELECT * FROM products WHERE id = ?";
    const result = await executeQuery(query, [id]);
    return result.length ? result[0] : null;
};

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
    const id = random();
    const product: UnitProduct = {
        id: id,
        ...productInfo,
    };
    const query = "INSERT INTO products SET ?";
    await executeQuery(query, product);
    return product;
};

export const update = async (id: string, updateValues: Product): Promise<UnitProduct | null> => {
    const product = await findOne(id);
    if (!product) return null;

    const updatedProduct: UnitProduct = {
        id,
        ...updateValues,
    };

    const query = "UPDATE products SET ? WHERE id = ?";
    await executeQuery(query, [updatedProduct, id]);
    return updatedProduct;
};

export const remove = async (id: string): Promise<void> => {
    const query = "DELETE FROM products WHERE id = ?";
    await executeQuery(query, [id]);
};


/*
//File based Storage
let products : Products = loadProducts();

function loadProducts () : Products {
    try {
        const data = fs.readFileSync("./products.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error ${error}`);
        return{};
    }
}

function saveProducts() {
    try {
        fs.writeFileSync("./products.json", JSON.stringify(products), "utf-8");
        console.log("Products saved successfully!")
    } catch (error) {
        console.log("Error", error)
    }
}


export const findAll = async (): Promise<UnitProduct []> => Object.values(products);

export const findOne = async (id: string):  Promise<UnitProduct> => products[id];

export const create = async (productInfo: Product):  Promise<UnitProduct | null> =>  {
    
    let id = random()

    let product = await findOne(id)

    while (product) {
        id = random()
        await findOne(id)
    }

    products[id] = {
        id : id,
        ...productInfo
    }

    saveProducts()

    return products[id]
}

export const update = async (id : string, updateValues : Product) : Promise<UnitProduct | null> => {
    
    const product = await findOne(id)

    if(!product) {
        return null
    }

    products[id] = {
        id,
        ...updateValues
    }

    saveProducts()

    return products[id]
}

export const remove = async (id : string) : Promise<null | void> => {

    const product = await findOne(id)

    if(!product) {
        return null
    }

    delete products[id]

    saveProducts()
    
}
*/