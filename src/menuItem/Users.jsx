import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const UserDataTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched users:", usersList);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        User Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Signup Time</TableCell>
            <TableCell>Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No user data available.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.ipAddress || "N/A"}</TableCell>
                <TableCell>
                  {user.signupTime
                    ? new Date(user.signupTime.seconds * 1000).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>{user.password || "N/A"}</TableCell>{" "}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserDataTable;
