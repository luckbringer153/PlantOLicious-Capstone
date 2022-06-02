// import { useState, useEffect } from "react";
// import { useAuth } from "./useAuth";
// import jwt_decode from "jwt-decode";

// export function useAdmin() {
//   const [admin, setAdmin] = useState([]);

//   const { token } = useAuth();
//   console.log(jwt_decode(token));
//   //grab email from token

//   useEffect(() => {
//     async function fetchMatchingAdmin(email) {
//       try {
//         const response = await fetch(`http://localhost:4000/api/users/admins`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(email),
//         });

//         const admin = await response.json();

//         setAdmin(admin);
//       } catch (error) {
//         throw error;
//       }
//     }

//     fetchMatchingAdmin(email);
//   }, []);

//   return { admin, setAdmin };
// }
