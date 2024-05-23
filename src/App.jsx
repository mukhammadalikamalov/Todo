import { Add, CopyAll, Delete, Edit } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { addTodo, fetchTodos, removeTodo } from "./core/redux/todo/todoAction";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [removeInput, setRemoveInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch(
        addTodo({
          title: input,
          userId: 1,
          completed: false,
        })
      );
      setInput("");
    }
  };

  const handleRemoveTodo = (index) => {
    setRemoveIndex(index);
    setRemoveInput("");
    setOpenRemove(true);
  };

  const handleConfirmRemove = () => {
    if (todos[removeIndex].title === removeInput.trim()) {
      dispatch(removeTodo(removeIndex));
      setOpenRemove(false);
      setRemoveIndex(null);
      setRemoveInput("");
    }
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setEditInput(todos[index].title);
    setOpenEdit(true);
  };

  const handleSaveEdit = () => {
    // Here you would dispatch an action to save the edited todo
    // e.g., dispatch(editTodo(editIndex, editInput));
    setOpenEdit(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="New Todo"
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTodo}
        startIcon={<Add />}
        fullWidth
      >
        Add
      </Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error loading todos</Alert>}
      <List>
        {todos.map((todo, index) => (
          <ListItem key={todo.id} divider>
            <ListItemText primary={todo.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditTodo(index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTodo(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Edit Todo"
            variant="outlined"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            startIcon={<Edit />}
            fullWidth
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box component="span" sx={{ fontWeight: 'bold', mr: 2 }}>{todos[removeIndex]?.title}</Box>
            <IconButton edge="end" aria-label="copy" onClick={() => setRemoveInput(todos[removeIndex]?.title)}>
              <CopyAll />
            </IconButton>
          </Box>
          <TextField
            label="Confirm Title to Remove"
            variant="outlined"
            value={removeInput}
            onChange={(e) => setRemoveInput(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmRemove}
            startIcon={<Delete />}
            fullWidth
          >
            Remove
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
