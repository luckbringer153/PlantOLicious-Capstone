import { useState, useEffect } from "react";

export function useUsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await fetch(`http://localhost:4000/api/users`, {
          headers: { "Content-Type": "application/json" },
        });

        const users = await response.json();

        setUsers(users);
      } catch (error) {
        throw error;
      }
    }

    fetchAllUsers();
  }, []);

  return { users, setUsers };
}
