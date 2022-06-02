const express = require("express");
const ordersRouter = express.Router();

const {
  getAllOrders,
  getOrderByUser,
  createOrder,
  destroyOrder,
  getUserOrderInCart,
  getOrderByUserId,
  patchOrder,
  getAllOrdersByUserId,
} = require("../db/models/orders");
const authorizeUser = require("./utils");

ordersRouter.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (err) {
    next(err);
  }
});
// curl http://localhost:4000/api/orders/ -X GET

// gets all orders based on email
// ordersRouter.get("/:userEmail", async (req, res, next) => {
//   try {
//     console.log("Made it in the orders API");

//     const orders = await getOrderByUser({ email: req.params });
//     res.send(orders);
//   } catch (err) {
//     next(err);
//   }
// });
// curl http://localhost:4000/api/orders/albert@mail.com -X GET

ordersRouter.get("/all/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const orders = await getAllOrdersByUserId(userId);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

//gets the latest (empty) order based on user ID
ordersRouter.get("/:userId", async (req, res, next) => {
  console.log("inside ordersRouter.get /:userId");

  try {
    const order = await getOrderByUserId(req.params.userId);

    console.log("order from api:", order);

    res.send(order);
  } catch (err) {
    next(err);
  }
});

//gets orders with status "cart" based on email
ordersRouter.get("/:userEmail/cart", async (req, res, next) => {
  console.log("inside api ordersRouter.get");

  try {
    const order = await getUserOrderInCart({ email: req.params.userEmail });

    console.log("what comes back:", order);

    res.send(order);
  } catch (err) {
    next(err);
  }
});

ordersRouter.post("/", async (req, res, next) => {
  console.log("THIS IS THE REQUEST", req.body);
  try {
    const {
      userId,
      orderStatus,
      totalPurchasePrice,
      totalQuantity,
      orderDate,
    } = req.body;

    const order = await createOrder(
      userId,
      orderStatus,
      totalPurchasePrice,
      totalQuantity,
      orderDate
    );

    res.send(order);
  } catch (err) {
    next(err);
  }
});
// curl http://localhost:4000/api/orders -X POST -H 'Content-Type':'application/json'

ordersRouter.delete("/:orderId", authorizeUser, async (req, res, next) => {
  try {
    const deletedOrder = await destroyOrder(req.params.orderId);
    res.send(deletedOrder);
  } catch (err) {
    next(err);
  }
});

module.exports = ordersRouter;

ordersRouter.patch("/:orderId", async (req, res, next) => {
  const { totalPurchasePrice, totalQuantity, orderDate } = req.body;
  try {
    const patchedOrder = await patchOrder({
      id: req.params.orderId,
      totalPurchasePrice,
      totalQuantity,
      orderDate,
    });
    res.send(patchedOrder);
  } catch (error) {
    next(error);
  }
});
