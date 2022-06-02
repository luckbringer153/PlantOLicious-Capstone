const client = require("../client");
const {
  getOrderProductsByOrder,
  destroyOrderProduct,
} = require("./products_in_order");

module.exports = {
  getAllOrders,
  createOrder,
  getOrderByUser,
  destroyOrder,
  getOrdersWithoutProducts,
  getUserOrderInCart,
  createOrderInitDB,
  getOrderByUserId,
  patchOrder,
  getAllOrdersByUserId,
};

//will be used when a user is registered and when a user checks out and needs a new "order"
async function createOrder(
  userId,
  orderStatus,
  totalPurchasePrice,
  totalQuantity,
  orderDate
) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
        INSERT INTO orders("userId", "orderStatus", "totalPurchasePrice", "totalQuantity", "orderDate")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
      [userId, orderStatus, totalPurchasePrice, totalQuantity, orderDate]
    );
    console.log(order);
    return order;
  } catch (err) {
    console.error(err);
  }
}

async function createOrderInitDB({
  userId,
  orderStatus,
  totalPurchasePrice,
  totalQuantity,
  orderDate,
}) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
        INSERT INTO orders("userId", "orderStatus", "totalPurchasePrice", "totalQuantity", "orderDate")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
      [userId, orderStatus, totalPurchasePrice, totalQuantity, orderDate]
    );
    console.log(order);
    return order;
  } catch (err) {
    console.error(err);
  }
}

async function getOrdersWithoutProducts() {
  try {
    const { rows: orders } = await client.query(`
        SELECT * FROM orders;
        `);

    return orders;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllOrders() {
  try {
    const { rows: orders } = await client.query(`
        SELECT orders.*,products_in_order."productId"
        FROM orders
        JOIN products_in_order ON orders.id = products_in_order."orderId"`);

    // console.log("orders gotten from db getAllOrders:", orders);

    return orders;
  } catch (err) {
    console.error(err);
  }
}
// SELECT orders.*,
//          JSON_AGG(
//             JSON_BUILD_OBJECT(
//                 'productId', op."productId",
//                  'price', op."eachPrice",
//                  'quantity', op."eachQuantity"
//              )
//          ) AS items
//         FROM orders
//             JOIN products_in_order AS op
//                 ON orders.id = op."orderId"
//         GROUP BY orders.id;`);

async function getUserOrderInCart({ email }) {
  console.log("inside db getUserOrderInCart");
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      SELECT orders.*,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'productId', op."productId",
                'price', op."eachPrice",
                'quantity', op."eachQuantity"
            )
        ) AS items
        FROM orders
            JOIN products_in_order AS op
                ON orders.id = op."orderId"
        WHERE email = $1 AND "orderStatus" = 'cart'
        GROUP BY orders.id;`,
      [email]
    );

    console.log("returned stuff:", order);

    return order;
  } catch (err) {
    console.error(err);
  }
}

//grabs the user's orders and any "products in order"'s they have as well
async function getOrderByUser({ email }) {
  try {
    const { rows: orders } = await client.query(
      `
      SELECT orders.*,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'productId',op."productId",
                'price', op."eachPrice",
                'quantity', op."eachQuantity"
            )
        ) AS items
        FROM orders
            LEFT JOIN products_in_order AS op
                ON orders.id = op."orderId"
        WHERE email = $1
        GROUP BY orders.id;`,
      [email]
    );

    return orders;
  } catch (err) {
    console.error(err);
  }
}

async function getAllOrdersByUserId(id) {
  try {
    const { rows: orders } = await client.query(
      `
      SELECT orders.*,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'productId',op."productId",
                'price', op."eachPrice",
                'quantity', op."eachQuantity"
            )
        ) AS items
        FROM orders
            LEFT JOIN products_in_order AS op
                ON orders.id = op."orderId"
        WHERE "userId" = $1
        GROUP BY orders.id;`,
      [id]
    );

    return orders;
  } catch (err) {
    console.error(err);
  }
}

//grabs the user's orders with no joining
async function getOrderByUserId(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      SELECT *
        FROM orders
        WHERE "userId" = $1 AND "orderStatus"='cart';`,
      [id]
    );

    return order;
  } catch (err) {
    console.error(err);
  }
}

async function destroyOrder(id) {
  try {
    const orderProducts = await getOrderProductsByOrder({ id });

    for (const op of orderProducts) {
      await destroyOrderProduct(op.id);
    }
    const {
      rows: [order],
    } = await client.query(
      `
   DELETE FROM orders
   WHERE id = $1
   RETURNING *`,
      [id]
    );

    return order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function patchOrder({
  id,
  totalPurchasePrice,
  totalQuantity,
  orderDate,
}) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    UPDATE orders
    SET "orderStatus"='pending', "totalPurchasePrice"=$2, "totalQuantity"=$3, "orderDate"=$4
    WHERE id=$1
    `,
      [id, totalPurchasePrice, totalQuantity, orderDate]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}
