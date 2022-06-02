const client = require("../client");

module.exports = {
  destroyCart,
  getCartProductById,
  addCartToProductsInOrderTable,
  destroyCartProduct,
};

async function addCartToProductsInOrderTable(
  orderId,
  productId,
  eachPrice,
  eachQuantity
) {
  console.log("reached addCartToProductsInOrderTable db function");

  try {
    const {
      rows: [cartProduct],
    } = await client.query(
      `
        INSERT INTO products_in_order("orderId","productId", "eachPrice", "eachQuantity")
        VALUES ($1, $2, $3,$4)
        RETURNING *;`,
      [orderId, productId, eachPrice, eachQuantity]
    );

    console.log("cartProduct from db", cartProduct);

    return cartProduct;
  } catch (err) {
    console.error(err);
  }
}

// async function addProductToExistingCart({
//   id,
//   productId,
//   eachPrice,
//   eachQuantity,
// }) {
//   console.log("reached addProductToExistingCart function");

//   try {
//     const {
//       rows: [cartProduct],
//     } = await client.query(
//       `
//       INSERT INTO cart("productId", "eachPrice", "eachQuantity")
//       WHERE id=$1
//       VALUES ($2,$3,$4)
//       RETURNING *;
//     `,
//       [id, productId, eachPrice, eachQuantity]
//     );

//     console.log("cartProduct", cartProduct);

//     return cartProduct;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function getCartProductById(id) {
  try {
    const {
      rows: [cartProduct],
    } = await client.query(
      `
        SELECT * FROM cart
        WHERE id = $1;`,
      [id]
    );

    return cartProduct;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// async function getCartProductsByOrder({ id }) {
//   try {
//     const { rows: cartProducts } = await client.query(
//       `
//     SELECT * FROM cart
//     WHERE "orderId" = $1;`,
//       [id]
//     );
//     return cartProducts;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// async function updateCartProduct({ id, productId, eachPrice, eachQuantity }) {
//   try {
//     const fields = { productId, eachPrice, eachQuantity };
//     for (const key in fields) {
//       if (fields[key] === undefined) delete fields[key];
//     }
//     const setString = Object.keys(fields)
//       .map((key, index) => `"${key}"=$${index + 2}`)
//       .join(", ");
//     const {
//       rows: [cartProduct],
//     } = await client.query(
//       `
//         UPDATE cart
//         SET ${setString}
//         WHERE id=$1
//         RETURNING *;`,
//       [id, ...Object.values(fields)]
//     );

//     return cartProduct;
//   } catch (err) {
//     console.error(err);
//   }
// }

async function destroyCart(id) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
        DELETE FROM cart
        WHERE id = $1
        RETURNING *;`,
      [id]
    );
    return cart;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function destroyCartProduct(cartId, productId) {
  try {
    const {
      rows: [cartProduct],
    } = await client.query(
      `
      DELETE FROM cart
      WHERE id=$1 AND "productId"=$2
      RETURNING *;
    `,
      [cartId, productId]
    );

    return cartProduct;
  } catch (error) {
    throw error;
  }
}
