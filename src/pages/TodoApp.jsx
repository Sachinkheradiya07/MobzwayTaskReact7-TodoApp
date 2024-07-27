import React, { useState } from "react";
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

  const handleAddList = () => {
    if (listName.trim() !== "") {
      setTodoLists([
        ...todoLists,
        {
          listName: listName,
          tasks: {
            low: [],
            medium: [],
            high: [],
          },
        },
      ]);
      setListName("");
    }
  };

  const handleAddTask = (listIndex) => {
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

    // Reset task input fields
    setTaskTitle("");
    setTaskDescription("");
    setTaskDate("");
    setTaskPriority("");
  };

  const moveTask = (
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
          <Grid item xs={12} sm={6} key={listIndex}>
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
                <TextField
                  label="Task Description"
                  type="text"
                  variant="outlined"
                  size="small"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Task Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    displayEmpty
                    variant="outlined"
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
                  onClick={() => handleAddTask(listIndex)}
                >
                  Add Task
                </Button>
                <br /> <br />
                <DndProvider backend={HTML5Backend}>
                  <Box display="flex" justifyContent="space-between">
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
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TodoApp;
