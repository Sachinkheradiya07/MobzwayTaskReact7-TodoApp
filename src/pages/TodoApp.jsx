import React, { useState, useEffect } from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Logout from "../Authentication/LogOut";
import {
  addListToFirestore,
  getListsFromFirestore,
  updateListInFirestore,
} from "../firestoreFunctions";

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
        <Typography variant="body2">{task.taskPriority}</Typography>
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
        width: "30%",
        textAlign: "center",
        border: "2px solid #ccc",
        p: 1,
        minHeight: 100,
      }}
    >
      <Typography variant="h4" align="center">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
  const [listName, setListName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const lists = await getListsFromFirestore();
      setTodoLists(lists);
    };
    fetchData();
  }, []);

  const handleAddList = async () => {
    if (listName.trim() !== "") {
      const newList = {
        listName: listName,
        tasks: {
          low: [],
          medium: [],
          high: [],
        },
      };
      const listId = await addListToFirestore(newList);
      setTodoLists([...todoLists, { id: listId, ...newList }]);
      setListName("");
    }
  };

  const handleAddTask = async (listIndex) => {
    if (taskTitle.trim() === "") {
      alert("Please enter a task title.");
      return;
    }

    const updatedLists = [...todoLists];
    const newTask = {
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskDate: taskDate,
      taskPriority: taskPriority,
    };
    updatedLists[listIndex].tasks[taskPriority].push(newTask);
    setTodoLists(updatedLists);

    // Update Firestore
    await updateListInFirestore(
      updatedLists[listIndex].id,
      updatedLists[listIndex]
    );

    // Reset task input fields
    setTaskTitle("");
    setTaskDescription("");
    setTaskDate("");
    setTaskPriority("");
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
    draggedTask.taskPriority = hoverPriority; // Update task priority
    updatedLists[hoverListIndex].tasks[hoverPriority].splice(
      hoverIndex,
      0,
      draggedTask
    );
    setTodoLists(updatedLists);

    // Update Firestore
    await updateListInFirestore(
      updatedLists[dragListIndex].id,
      updatedLists[dragListIndex]
    );
    await updateListInFirestore(
      updatedLists[hoverListIndex].id,
      updatedLists[hoverListIndex]
    );
  };

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
          <Grid item xs={12} sm={6} key={list.id}>
            <Box sx={{ border: "1px solid #ccc", p: 2, mb: 2 }}>
              <Typography variant="h4" align="center">
                {list.listName}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label="Task Title"
                    type="text"
                    variant="outlined"
                    size="small"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label="Task Description"
                    type="text"
                    variant="outlined"
                    size="small"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField
                    label="Task Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    displayEmpty
                    variant="outlined"
                    size="small"
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
              </Box>
              <DndProvider backend={HTML5Backend}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  {["low", "medium", "high"].map((priority) => (
                    <TaskContainer
                      key={priority}
                      priority={priority}
                      tasks={list.tasks[priority]}
                      moveTask={moveTask}
                      listIndex={listIndex}
                    />
                  ))}
                </Box>
              </DndProvider>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TodoApp;
