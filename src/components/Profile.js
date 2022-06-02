import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useAuth } from "../custom-hooks";

//The profile will hold basic user information on the left. On the right, it'll have a list of orders the user has made. Each order will show the products "inside" them, the total price paid, the total quantity of items and when the order was placed.

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log(data);

        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [token]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        console.log(profile.id);
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/orders/all/${profile.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userOrders = await response.json();
        console.log(userOrders);
        setOrders(userOrders);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrders();
  }, [profile, token]);

  return (
    <section className="profileBlock">
      <h1 className="eachComponent hello">
        Welcome to your profile, {profile.email}
      </h1>
      <div className="separateUsersAndOrders">
        <section className="listOfAllUsers">
          <label className="labels">User Settings:</label>
          <div className="spacing">
            This area is still under construction. Please come back another time
            to view your user settings :)
          </div>
        </section>

        <section className="previousOrders">
          <label className="labels">Previous Orders:</label>
          <table className="spacing">
            <tr>
              <th className="eachComponent ">Order Number</th>
              <th className="eachComponent">Order Date</th>
              <th className="eachComponent">Order Status</th>
              <th className="eachComponent">Total Purchase Price</th>
            </tr>
            {orders &&
              orders.map((order) => {
                const { id, orderDate, orderStatus, totalPurchasePrice } =
                  order;
                return (
                  <tbody key={id}>
                    <tr>
                      <td>{id}</td>
                      <td>{orderDate}</td>
                      <td>{orderStatus}</td>
                      <td>{totalPurchasePrice}</td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </section>
      </div>
    </section>
  );

  // return <div>Welcome to your profile!</div>;
}
