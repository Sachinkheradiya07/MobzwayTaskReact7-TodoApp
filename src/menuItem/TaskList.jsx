import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const todoListsCollection = collection(db, "todoLists");
        const todoListsSnapshot = await getDocs(todoListsCollection);

        if (todoListsSnapshot.empty) {
          console.log("No todo lists found.");
          setTasks([]);
        } else {
          const listsData = todoListsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const aggregatedData = listsData.reduce((acc, list) => {
            const listName = list.listName;
            if (!acc[listName]) {
              acc[listName] = {
                listName,
                authorEmail: list.authorEmail,
                createdTime: list.createdTime,
                updatedTime: list.updatedTime,
                taskCount: 0,
              };
            }
            acc[listName].taskCount += Object.values(list.tasks).flat().length;
            return acc;
          }, {});

          // Convert aggregated data to array
          const taskArray = Object.values(aggregatedData);
          setTasks(taskArray);
        }
      } catch (error) {
        console.error("Error fetching tasks data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Task Lists
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>List Name</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Number of Tasks</TableCell>
              <TableCell>Creation Time</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.listName}</TableCell>
                <TableCell>{task.authorEmail}</TableCell>
                <TableCell>{task.taskCount}</TableCell>
                <TableCell>
                  {new Date(task.createdTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(task.updatedTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskList;
