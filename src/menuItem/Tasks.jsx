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
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Tasks = () => {
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
          const allTasks = listsData.flatMap((list) =>
            Object.values(list.tasks)
              .flat()
              .map((task) => ({ ...task, listName: list.listName }))
          );
          setTasks(allTasks);
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
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Title</TableCell>
              <TableCell>Task List Title</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Creation Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.taskTitle}</TableCell>
                <TableCell>{task.listName}</TableCell>
                <TableCell>{task.taskDescription}</TableCell>
                <TableCell>{task.authorEmail}</TableCell>
                <TableCell>
                  {new Date(task.createdTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;
