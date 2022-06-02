import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../custom-hooks";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import cartIcon from "../assets/shoppingcarticon.jpg";

//for search bar
//import { useLocation, useHistory } from "react-router-dom";

export default function AllProductViews(props) {
  const [products, setProducts] = useState([]);
  const { cartItems, setCartItems, cartQuantity, setCartQuantity } = props;
  const { token, isAdminAC } = useAuth();
  const history = useHistory();

  // Used in "items in cart" indicator
  let cartItemsToRender = [];
  let email;
  let counter = 0;

  if (token) {
    email = jwt_decode(token).email;
  } else {
    email = "guest@mail.com";
  }

  // If there are items in the cart, then for every item in the cart, check if the item's email matches that of the current user. If there's a match, "render"/count that item in the array cartItemsToRender.
  // However, if that item's quantity is larger than 1, add that number to the counter; this counter will be added to the indicator itself last.
  useEffect(() => {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].userEmail === email) {
        cartItemsToRender[i] = cartItems[i];
      }

      if (cartItemsToRender[i] && cartItemsToRender[i].qty > 1) {
        counter += cartItemsToRender[i].qty - 1;
      }

      setCartQuantity(counter + cartItemsToRender.length);
    }
  }, [cartItems]);

  /*
  //search box???
  const { search } = useLocation();
  const history = useHistory();
  console.log("search", search);
  const searchParams = new URLSearchParams(search);
  console.log("searchParams", searchParams);
  const searchTerm = searchParams.get("searchTerm") || "";
  console.log("searchTerm", searchTerm);
*/

  //This will run after everything else has run, guaranteeing that the console.log actually catches what happens to cartItems
  useEffect(() => {
    console.log("This is the current cart state", cartItems);
  }, [cartItems]);

  // adds item to the cart when the "add to cart" button is clicked; makes sure the current user's email comes along for the ride
  const addItemToCart = async (product) => {
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

  // fetches all products for product list; runs last
  useEffect(() => {
    //create as async fetch function
    async function fetchProducts() {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/products
        `,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //unpacked the response stream
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        //giving me a syntaxerror:unexpected token <in JSON at position 0
        console.log(error);
      }
    }

    // call it
    fetchProducts();
  }, []);

  //takes user to cart when they click the cart icon
  async function goToCart() {
    history.push("./cart");
  }

  //takes user to the top of the page when clicked
  async function toTopFunction() {
    document.body.scrollTop = 0; //for Safari
    document.documentElement.scrollTop = 0; //for Chrome, Firefox, IE, Opera
  }

  useEffect(() => {
    //scroll logic part 1
    const toTopButton = document.getElementById("toTopButton");
    window.onscroll = function () {
      scrollFunction();
    };

    //scroll logic part 2
    async function scrollFunction() {
      try {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          toTopButton.style.display = "block";
        } else {
          toTopButton.style.display = "none";
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

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
    <>
      {isAdminAC && (
        <Link to="/addnewproduct" className="linkToAddingProduct">
          Add New Product
        </Link>
      )}
      <section className="allPlantsBlock">
        {products &&
          products.map((product) => {
            const {
              id,
              title,
              price,
              description,
              photoLinkHref,
              inStockQuantity,
            } = product;

            return (
              <div className="eachPlantBlock" key={id}>
                <Link to={"/products/" + id} className="eachPlantInfo">
                  <img
                    src={photoLinkHref}
                    alt="The plant"
                    className="plantPicForSale"
                  ></img>

                  <h3 className="eachPlantTitle">{title}</h3>
                  <p>${price}</p>
                  <p>{description}</p>
                </Link>
                <button
                  onClick={() => addItemToCart(product)}
                  className="buttonAddToCartFromAllProducts linkToAddingToCart"
                >
                  Add to Cart
                </button>

                {isAdminAC && (
                  <Link
                    to={`/editproduct/?title=${title}&price=${price}&description=${description}&photoLinkHref=${photoLinkHref}&inStockQuantity=${inStockQuantity}&id=${id}`}
                    className="linkToEditingProduct"
                  >
                    Edit Product
                  </Link>
                )}
                {/* if you're the admin, you should be able to edit/delete a product using a button on the "single product info" page, not here. */}
              </div>
            );
          })}
      </section>
      <aside className="cartIconBucket">
        <img
          src={cartIcon}
          alt="shoppingcarticon"
          id="cartIndicatorAndButton"
          title="Go To Cart"
          onClick={goToCart}
        ></img>
        <p id="numberInCart">{cartQuantity}</p>
      </aside>

      <button onClick={toTopFunction} id="toTopButton" title="Go to Top">
        Top
      </button>
    </>
  );
}
