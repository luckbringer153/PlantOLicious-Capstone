const client = require("../client");

//only admin should be able to do this, aside from setting up the initial database
async function createProduct({
  title,
  price,
  description,
  category,
  inStockQuantity,
  photoLinkHref,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        INSERT INTO products (title, price, description, category, "inStockQuantity", "photoLinkHref" )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
      [title, price, description, category, inStockQuantity, photoLinkHref]
    );
    return product;
  } catch (err) {
    throw err;
  }
}

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(
      `SELECT * 
       FROM products;
       `
    );

    return products;
  } catch (err) {
    throw err;
  }
}

//only admin should be able to do this
async function updateProduct({
  title,
  price,
  description,
  category,
  inStockQuantity,
  photoLinkHref,
  id,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET title=$1, price=$2, description=$3, category=$4,  "inStockQuantity"=$5, "photoLinkHref"=$6
    WHERE id=$7
    RETURNING *;
    `,
      [title, price, description, category, inStockQuantity, photoLinkHref, id]
    );

    return product;
  } catch (err) {
    throw err;
  }
}

async function getProductById(id) {
  try {
    const { rows: product } = await client.query(
      `
      SELECT * 
      FROM products
      WHERE id=$1;
      `,
      [id]
    );

    return product;
  } catch (err) {
    throw err;
  }
}

//only admin should be able to do this
async function destroyProduct(id) {
  try {
    const { rows: product } = await client.query(
      `
      DELETE
      FROM products
      WHERE id=$1
      RETURNING *;
      `,
      [id]
    );

    return product;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  destroyProduct,
};
