const express = require("express");
const {
  addCartToProductsInOrderTable,
  getCartProductById,
  // destroyCart,
  // addProductToExistingCart,
  // destroyCartProduct,
} = require("../db/models/products_in_order");
// const { getProductById } = require("../db/models/products");
const authorizeUser = require("./utils");
const productsInOrderRouter = express.Router();

//POST /:orderId
//add all products in cart state to products_in_order table with matching orderIds
productsInOrderRouter.post("/:orderId", async (req, res, next) => {
  try {
    //grab all products from cart state array
    const orderId = req.params.orderId;
    const { productId, price, qty } = req.body;
    const eachPrice = price;
    const eachQuantity = qty;
    console.log(
      "coming into api productsInOrderRouter.post:",
      orderId,
      productId,
      eachPrice,
      eachQuantity
    );

    const cartProduct = await addCartToProductsInOrderTable(
      orderId,
      productId,
      eachPrice,
      eachQuantity
    );

    console.log("returned api cartProduct:", cartProduct);

    res.send(cartProduct);
  } catch (err) {
    next(err);
  }
});
// curl http://localhost:4000/api/products_in_order/1 -X POST -H 'Content-Type:application/json' -d '{"productId":"6","price":"20.00","qty":"1"}' :)

//PATCH OR POST???? /:cartId
//adds product to existing cart
// productsInOrderRouter.post("/:cartId", async (req, res, next) => {
//   try {
//     const { productId, eachPrice, eachQuantity } = req.body;
//     const id = req.params.cartId;
//     console.log(
//       "In productsInOrderRouter.patch, receiving:",
//       id,
//       productId,
//       eachPrice,
//       eachQuantity
//     );

//     const cartProduct = await addProductToExistingCart({
//       id,
//       productId,
//       eachPrice,
//       eachQuantity,
//     });

//     console.log("returned cartProduct:", cartProduct);

//     res.send(cartProduct);
//   } catch (error) {
//     next(error);
//   }
// });
// curl http://localhost:4000/api/cart/1 -X POST -H "Content-Type:application/json" -d '{"productId":"4","eachPrice":"16:00","eachQuantity":"1"}'

//GET /:cartId
//gets an order and its products using the orderId
productsInOrderRouter.get("/:cartId", authorizeUser, async (req, res, next) => {
  try {
    const cart = await getCartProductById(req.params.cartId);

    console.log("returned cart with given ID:", cart);

    res.send(cart);
  } catch (error) {
    next(err);
  }
});
// curl http://localhost:4000/api/cart/:cartId :)

//DELETE /:cartId/:productId
//delete specific product from cart
// productsInOrderRouter.delete("/:cartId/:productId", async (req, res, next) => {
//   try {
//     const cartProduct = await destroyCartProduct(
//       req.params.cartId,
//       req.params.productId
//     );

//     console.log(
//       "this item,",
//       cartProduct,
//       "was deleted from cart",
//       req.params.cartId
//     );

//     res.send(cartProduct);
//   } catch (error) {
//     next(error);
//   }
// });
// // curl http://localhost:4000/api/cart/2/1 -X DELETE :)
// //returns "undefined" if you try and get a cart that had its last item deleted in this manner

// //DELETE /:cartId
// //delete entire cart
// productsInOrderRouter.delete("/:cartId", async (req, res, next) => {
//   try {
//     const cart = await destroyCart(req.params.cartId);

//     console.log("deleted this cart:", cart);

//     res.send(cart);
//   } catch (err) {
//     next(err);
//   }
// });
// curl http://localhost:4000/api/cart/:cartId -X DELETE :)

module.exports = productsInOrderRouter;
