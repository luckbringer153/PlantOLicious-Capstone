import React, { useState } from "react";
import { useAuth } from "../custom-hooks";
import { useHistory } from "react-router-dom";
import plantPic1 from "../assets/PlantForLogRegPage.JPG";

export default function LoginOrRegister(props) {
  const history = useHistory();
  // const { userId, setUserId } = props;

  const { updateAuthStatus } = useAuth();

  const currentURL = window.location.href;
  const loginOrRegister = currentURL.slice(22);

  const [form, setForm] = useState({ email: "", password: "" });

  function checkEmail(email) {
    const correctFormat = /\S+@\S+\.\S+/;
    return correctFormat.test(email); //returns true or false
  }

  async function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // useEffect(() => {
  //   if (localStorage.getItem("userId")) {
  //     setUserId(parseInt(localStorage.getItem("userId")));
  //   } else {
  //     setUserId(0);
  //   }
  // }, [userId]);

  async function handleSubmit(event) {
    event.preventDefault();

    // console.log("Form is getting this in component:", form);
    console.log("THIS IS THE REGISTER FORM", form);
    //ensure that people are entering in valid emails
    if (checkEmail(form.email)) {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/users/${loginOrRegister}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );

        const { user, token } = await response.json();

        localStorage.setItem("userId", user.id);

        // setUserId(parseInt(localStorage.getItem("userId")));
        // localStorage.setItem("userId", user.id);

        if (user) {
          localStorage.ft_token = token;
          updateAuthStatus();

          if (loginOrRegister === "register") {
            // create new "cart" (order with orderStatus of "cart")
            const response2 = await fetch(
              `https://plantolicious.herokuapp.com/api/orders`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: parseInt(localStorage.getItem("userId")),
                  orderStatus: "cart",
                  totalPurchasePrice: 0,
                  totalQuantity: 0,
                  orderDate: new Date(),
                }),
              }
            );

            const newOrder = await response2.json();

            console.log(newOrder);
          }

          //redirect based on if user is an admin or not
          if (user.isAdmin === true) {
            console.log(
              `Success! Welcome admin ${user.email} with bearer token ${token}.`
            );
            history.push("./adminprofile");
          } else if (user.isAdmin === false) {
            console.log(
              `Success! Welcome ${user.email} with bearer token ${token} and userId${user.id}.`
            );
            history.push("./profile");
          }
        } else {
          if (user) {
            localStorage.ft_token = token;
            updateAuthStatus();
            // console.log(
            //   `Success! Welcome ${user.email} with bearer token ${token}.`
            // );
            history.push("/profile");
          } else {
            throw new Error(`error with user action, ${loginOrRegister}`);
          }
        }
      } catch (error) {
        window.alert(
          "Oops, something went wrong! Please ensure you've entered a valid username and/or password combination."
        );
        throw error;
      }
    } else {
      window.alert("Please enter a valid email address.");
    }
  }

  async function clickShowPassword() {
    const input = document.getElementById("passwordTypingZone");

    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

  return (
    <div className="loginPageContainer">
      <aside className="flowerPower">
        <img
          src={plantPic1}
          alt="Grape-O-Licious Flower"
          className="grapeoliciousPhoto"
        ></img>
        <p className="grapeoliciousText">
          <i>Torenia Catalina</i>, or "Grape-O-Licious"
        </p>
      </aside>
      <form onSubmit={handleSubmit} className="userInfoInputs">
        <div className="loginBucket">
          <div className="loginLabels">
            <label style={{ marginRight: 5 + "px" }}>
              {loginOrRegister === "register" && "Choose "} Email Username
            </label>
            <label
              style={
                ({ marginRight: 5 + "px" }, { borderTop: "black solid 1px" })
              }
            >
              {loginOrRegister === "register" && "Choose "} Password
            </label>
          </div>
          <div className="loginInputs">
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="emailUsernameInput"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              id="passwordTypingZone"
              className="passwordInput"
            />
          </div>
          <aside className="showPasswordAside">
            <input type="checkbox" onClick={clickShowPassword} />
            Show Password
          </aside>
        </div>
        <input
          type="submit"
          value={loginOrRegister === "register" ? "Register" : "Login"}
          className="loginRegButton"
        />
      </form>
    </div>
  );
}
