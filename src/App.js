//TO RESTART BACKEND SERVER: "sudo service postgresql restart"

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useAuth } from "./custom-hooks";
import {
  LoginOrRegister,
  Title,
  Nav,
  Footer,
  Profile,
  AllProductViews,
  SingleProductView,
  Cart,
  AdminProfile,
  Home,
  AddNewProduct,
  EditProduct,
} from "./components";

function App() {
  const { isLoggedIn, isAdminAC } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);

  return (
    <Router>
      <Title />

      <Nav />

      <Switch>
        {/* routes for if you're not logged in */}
        {!isLoggedIn && (
          <>
            <Route
              exact
              path="/products"
              render={() => (
                <AllProductViews
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              )}
            />
            <Route
              path="/products/:productId"
              render={() => (
                <SingleProductView
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              )}
            />
            <Route
              path="/cart"
              render={() => (
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
              )}
            />
            <Route path="/login" render={() => <LoginOrRegister />} />
            <Route path="/register" render={() => <LoginOrRegister />} />
            <Route path="/home" component={Home} />
          </>
        )}

        {/* routes for if you are logged in */}
        {isLoggedIn && (
          <>
            <Route
              exact
              path="/products"
              render={() => (
                <AllProductViews
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  cartQuantity={cartQuantity}
                  setCartQuantity={setCartQuantity}
                />
              )}
            />
            <Route
              path="/products/:productId"
              render={() => (
                <SingleProductView
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              )}
            />
            <Route
              path="/cart"
              render={() => (
                <Cart
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  cartQuantity={cartQuantity}
                  setCartQuantity={setCartQuantity}
                />
              )}
            />
            <Route path="/profile" component={Profile} />
            <Route path="/home" component={Home} />

            {/* admin-only routes - if you're not an admin, trying to go to route "/adminprofile" will lead to disappointment */}
            {isAdminAC && (
              <>
                <Route path="/adminprofile" component={AdminProfile} />
                <Route path="/editproduct" component={EditProduct} />
                <Route path="/addnewproduct" component={AddNewProduct} />
              </>
            )}
          </>
        )}

        {/* catches errors */}
        <Redirect to="/home" />
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
