import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isAdminAC, setIsAdminAC] = useState(false);
  let history;
  useEffect(() => {
    setToken(localStorage.ft_token || "");
  }, [shouldUpdate]);

  const updateAuthStatus = () => setShouldUpdate(!shouldUpdate);

  const logout = () => {
    console.log(history);
    setIsAdminAC(false);
    localStorage.removeItem("userId");
    window.location.href = "/home";
    //you can delete the cart info stored in local storage here
    localStorage.removeItem("ft_token");
    // delete localStorage.ft_token;
    updateAuthStatus();
  };

  useEffect(() => {
    if (token) {
      // console.log(jwt_decode(token));
      const userEmail = jwt_decode(token).email; //plantboss@mail.com
      // console.log(userEmail);

      // async function fetchMatchingAdmin(email) {
      //   try {
      //     const response = await fetch(`http://localhost:4000/api/users/admins`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${token}`,
      //       },
      //       body: JSON.stringify(email),
      //     });

      //     const { isAdmin } = await response.json();

      //     return isAdmin;
      //   } catch (error) {
      //     throw error;
      //   }
      // }

      async function fetchUserByUsername(email) {
        try {
          const response = await fetch(
            `http://localhost:4000/api/users/${email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              // body: JSON.stringify(email),
            }
          );

          const user = await response.json();

          // console.log("from AuthContext:", user);

          // const { isAdmin } = user;
          // console.log("what isAdmin should be:", isAdmin);
          if (user.isAdmin === true) {
            setIsAdminAC(true);
          }
          return user;
        } catch (error) {
          throw error;
        }
      }

      fetchUserByUsername(userEmail);
    }
  }, [token]);

  const providerValue = {
    token,
    isLoggedIn: !!token,
    updateAuthStatus,
    logout,
    isAdminAC,
  };

  // console.log("providerValue:", providerValue);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}
