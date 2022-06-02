import React from "react";
import { useUsersList } from "../custom-hooks";
// import { useAuth } from "../custom-hooks";
// import jwt_decode from "jwt-decode";

//The profile will show the admin every user on the site. Create/Edit/Delete Post functionality will happen on each product's card.

export default function AdminProfile() {
  const { users } = useUsersList();
  // const { token } = useAuth();
  // const userEmail = jwt_decode(token).email;

  return (
    <section className="profileBlock">
      <h1 className="eachComponent hello">Welcome to your profile, admin! </h1>
      <div className="separateUsersAndOrders">
        <section className="listOfAllUsers">
          <label className="labels">User's List:</label>
          {users &&
            users.map((user) => {
              const { id, email } = user;

              return (
                <div className="eachUserInList" key={id}>
                  <h3 className="eachComponent">User #{id}</h3>
                  <p>Email: {email}</p>
                </div>
              );
            })}
        </section>
        <section className="previousOrders">
          <label className="labels">Previous Orders:</label>
          <div className="eachComponent spacing">
            This is where your previous orders would go if you were a regular
            user.
          </div>
        </section>
      </div>
    </section>
  );
}
