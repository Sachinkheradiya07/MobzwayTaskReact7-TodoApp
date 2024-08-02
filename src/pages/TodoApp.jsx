import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Logout from "../Authentication/LogOut";
import { AuthContext } from "../Authentication/AuthContext";

const ItemTypes = {
  TASK: "task",
};

const Task = ({ task, index, moveTask, priority, listIndex }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index, priority, listIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Box
        sx={{
          mb: 1,
          p: 1,
          border: "1px solid #ccc",
          backgroundColor: "#f0f0f0",
          borderRadius: 4,
          cursor: "move",
        }}
      >
        <Typography variant="subtitle1">{task.taskTitle}</Typography>
        <Typography variant="body2">{task.taskDescription}</Typography>
        <Typography variant="body2">{task.taskDate}</Typography>
        <Typography variant="body2">Priority: {task.taskPriority}</Typography>
        <Typography variant="body2">Created by: {task.authorEmail}</Typography>
        <Typography variant="body2">Created on: {task.createdTime}</Typography>
        {task.updatedTime && (
          <Typography variant="body2">
            Updated on: {task.updatedTime}
          </Typography>
        )}
      </Box>
    </div>
  );
};

const TaskContainer = ({ priority, tasks, moveTask, listIndex }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.priority !== priority || item.listIndex !== listIndex) {
        moveTask(
          item.index,
          tasks.length,
          item.priority,
          priority,
          item.listIndex,
          listIndex
        );
        item.priority = priority;
        item.listIndex = listIndex;
      }
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        width: "100%",
        textAlign: "center",
        border: "2px solid #ccc",
        p: 1,
        minHeight: 100,
        borderRadius: 4,
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ textTransform: "capitalize", mb: 1 }}
      >
        {priority}
      </Typography>
      <Box>
        {tasks.map((task, index) => (
          <Task
            key={index}
            index={index}
            task={task}
            moveTask={moveTask}
            priority={priority}
            listIndex={listIndex}
          />
        ))}
      </Box>
    </Box>
  );
};

const TodoApp = () => {
  const { currentUser } = useContext(AuthContext);
  const [listName, setListName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
    } else {
      const fetchTodoLists = async () => {
        try {
          setLoading(true);
          const todoListsCollection = collection(db, "todoLists");
          const q = query(
            todoListsCollection,
            where("userId", "==", currentUser.uid)
          );
          const todoListsSnapshot = await getDocs(q);

          if (todoListsSnapshot.empty) {
            console.log("No todo lists found.");
          } else {
            const todoListsData = todoListsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTodoLists(todoListsData);
          }
        } catch (error) {
          console.error("Error fetching todo lists data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTodoLists();
    }
  }, [currentUser]);

  const handleAddList = async () => {
    if (listName.trim() !== "") {
      const newList = {
        listName: listName,
        tasks: {
          low: [],
          medium: [],
          high: [],
        },
        userId: currentUser.uid,
        authorEmail: currentUser.email,
        createdTime: new Date().toISOString(),
        updatedTime: null,
      };
      try {
        const docRef = await addDoc(collection(db, "todoLists"), newList);
        setTodoLists([...todoLists, { ...newList, id: docRef.id }]);
        setListName("");
      } catch (error) {
        console.error("Error adding new list:", error);
        setError("Could not add list. Try again.");
      }
    }
  };

  const handleAddTask = async (listIndex) => {
    if (taskTitle.trim() === "") {
      alert("Please enter a task title.");
      return;
    }

    const newTask = {
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskDate: taskDate,
      taskPriority: taskPriority,
      authorEmail: currentUser.email,
      createdTime: new Date().toISOString(),
      updatedTime: null,
      userId: currentUser.uid,
    };

    const updatedLists = [...todoLists];
    updatedLists[listIndex].tasks[taskPriority].push(newTask);

    try {
      const listId = updatedLists[listIndex].id;
      await updateDoc(doc(db, "todoLists", listId), {
        tasks: updatedLists[listIndex].tasks,
      });
      setTodoLists(updatedLists);
      setTaskTitle("");
      setTaskDescription("");
      setTaskDate("");
      setTaskPriority("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Could not add task. Try again.");
    }
  };

  const moveTask = async (
    dragIndex,
    hoverIndex,
    dragPriority,
    hoverPriority,
    dragListIndex,
    hoverListIndex
  ) => {
    const updatedLists = [...todoLists];
    const draggedTask = updatedLists[dragListIndex].tasks[dragPriority].splice(
      dragIndex,
      1
    )[0];
    draggedTask.taskPriority = hoverPriority;
    draggedTask.updatedTime = new Date().toISOString();
    updatedLists[hoverListIndex].tasks[hoverPriority].splice(
      hoverIndex,
      0,
      draggedTask
    );

    try {
      const listId = updatedLists[hoverListIndex].id;
      await updateDoc(doc(db, "todoLists", listId), {
        tasks: updatedLists[hoverListIndex].tasks,
      });
      setTodoLists(updatedLists);
    } catch (error) {
      console.error("Error moving task:", error);
      setError("Could not move task. Try again.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <>
      <Logout />
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Enter List Name"
            type="text"
            variant="outlined"
            size="small"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddList}
        >
          Add List
        </Button>
      </Box>
      <hr style={{ width: "100%" }} />
      <Grid container spacing={2}>
        {todoLists.map((list, listIndex) => (
          <Grid item xs={12} sm={6} key={listIndex}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 4,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" align="center">
                {list.listName}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Enter Task Title"
                  type="text"
                  variant="outlined"
                  size="small"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Enter Task Description"
                  type="text"
                  variant="outlined"
                  size="small"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label=""
                  type="date"
                  variant="outlined"
                  size="small"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  variant="outlined"
                  size="small"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Priority
                  </MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleAddTask(listIndex)}
              >
                Add Task
              </Button>
              <hr style={{ width: "100%", margin: "20px 0" }} />
              <DndProvider backend={HTML5Backend}>
                <TaskContainer
                  priority="low"
                  tasks={list.tasks.low}
                  moveTask={moveTask}
                  listIndex={listIndex}
                />
                <TaskContainer
                  priority="medium"
                  tasks={list.tasks.medium}
                  moveTask={moveTask}
                  listIndex={listIndex}
                />
                <TaskContainer
                  priority="high"
                  tasks={list.tasks.high}
                  moveTask={moveTask}
                  listIndex={listIndex}
                />
              </DndProvider>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TodoApp;
