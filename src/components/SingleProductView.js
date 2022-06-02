import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useAuth } from "../custom-hooks";
import jwt_decode from "jwt-decode";

export default function SingleProduct(props) {
  const [product, setProduct] = useState();
  const { cartItems, setCartItems } = props;
  const history = useHistory();
  let { productId } = useParams();
  const { token, isAdminAC } = useAuth();

  const addItemToCart = async ([product]) => {
    const getToken = localStorage.getItem("ft_token");
    let userEmail;
    if (getToken) {
      userEmail = jwt_decode(getToken).email;
    } else {
      userEmail = "guest@mail.com";
    }
    const targetProduct = await cartItems.find((item) => {
      return item.product.id === product.id;
    });

    if (targetProduct) {
      const mapStuff = cartItems.map((item) => {
        return item.product.id === product.id
          ? { ...targetProduct, qty: targetProduct.qty + 1 }
          : item;
      });
      setCartItems(mapStuff);
    } else {
      setCartItems([...cartItems, { product, qty: 1, userEmail }]);
    }
  };

  async function handleDelete(productId) {
    let answer = false;

    answer = window.confirm(
      "Are you sure you want to delete this happy plant? This action cannot be undone."
    );

    if (answer) {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/products/${productId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        console.log({ data });

        history.push(`/products`);
      } catch (err) {
        throw err;
      }
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/products/${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const product = await response.json();

        setProduct(product);
      } catch (err) {
        console.error(err);
      }
    };

    getProduct();
  }, [productId]);

  // START OF ANIMATION JS
  const addToCartButton = document.getElementsByClassName(
    "buttonAddToCartFromAllProducts"
  );

  Array.prototype.forEach.call(addToCartButton, function (b) {
    b.addEventListener("click", createRipple);
  });

  function createRipple(event) {
    let ripple = document.createElement("span");
    ripple.classList.add("ripple");

    let max = Math.max(this.offsetWidth, this.offsetHeight);

    ripple.style.width = ripple.style.height = max * 2 + "px";

    let rect = this.getBoundingClientRect();

    ripple.style.left = event.clientX - rect.left - max + "px";
    ripple.style.top = event.clientY - rect.top - max + "px";

    this.appendChild(ripple);
  }
  // END OF ANIMATION JS

  return (
    <section
      className="allPlantsBlock"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {product &&
        product.map(
          ({
            id,
            title,
            price,
            description,
            category,
            inStockQuantity,
            photoLinkHref,
          }) => {
            return (
              <section className="eachPlantBlock" key={id}>
                <h2>{title}</h2>
                <span>Price: ${price}</span>
                <img
                  className="plantPicForSale"
                  src={photoLinkHref}
                  alt={product.title}
                />
                <h5>{category}</h5>
                <p>{description}</p>
                <button
                  className="buttonAddToCartFromAllProducts linkToAddingToCart"
                  onClick={() => addItemToCart(product)}
                >
                  Add to Cart
                </button>
                {isAdminAC && (
                  <>
                    <Link
                      to={`/editproduct/?title=${title}&price=${price}&description=${description}&photoLinkHref=${photoLinkHref}&inStockQuantity=${inStockQuantity}&id=${id}`}
                      className="buttonAddToCartFromAllProducts linkToEditingProduct"
                    >
                      Edit Product
                    </Link>
                    <button
                      className="buttonAddToCartFromAllProducts linkToDeletingProduct"
                      onClick={() => handleDelete(id)}
                    >
                      Delete Product
                    </button>
                  </>
                )}
              </section>
            );
          }
        )}
    </section>
  );
}
