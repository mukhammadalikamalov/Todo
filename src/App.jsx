import { Add, CopyAll, Delete, Edit, CheckCircle, EmojiObjects } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Modal,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { addTodo, fetchTodos, removeTodo, editTodo } from "./core/redux/todo/todoAction";

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
  borderRadius: 5,
};

const TodoList = React.memo(({ todos, handleEditTodo, handleRemoveTodo }) => {
  return (
    <List>
      {todos.map((todo, index) => (
        <ListItem key={todo.id} divider={false}>
          <Box bgcolor="#ffffff" p={2} borderRadius={5} width="100%" display="flex" alignItems="center">
            <ListItemText primary={todo.title} />
            <ListItemSecondaryAction style={{ marginRight: 10 }}>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditTodo(index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTodo(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </Box>
        </ListItem>
      ))}
    </List>
  );
});

function App() {
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [removeInput, setRemoveInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openToast, setOpenToast] = useState(false); // State for the toast
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = useCallback(() => {
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
  }, [dispatch, input]);

  const handleRemoveTodo = useCallback((index) => {
    setRemoveIndex(index);
    setRemoveInput("");
    setOpenRemove(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (todos[removeIndex].title === removeInput.trim()) {
      dispatch(removeTodo(removeIndex));
      setOpenRemove(false);
      setRemoveIndex(null);
      setRemoveInput("");
      setOpenToast(true); // Show the toast
    }
  }, [dispatch, removeInput, removeIndex, todos]);

  const handleEditTodo = useCallback((index) => {
    setEditIndex(index);
    setEditInput(todos[index].title);
    setOpenEdit(true);
  }, [todos]);

  const handleSaveEdit = useCallback(() => {
    dispatch(editTodo(editIndex, editInput));
    setOpenEdit(false);
    setEditIndex(null);
    setEditInput("");
  }, [dispatch, editIndex, editInput]);

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto', mt: 4, bgcolor: '#ffec9e', borderRadius: 5 }}> {/* Change the main container color */}
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          sx={{ backgroundColor: "#ffffff" }}
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
          sx={{ ml: 2, height: '100%', mt: 1, borderRadius: 5 }}
        >
          Add
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">Error loading todos</Alert>}
      <TodoList
        todos={todos}
        handleEditTodo={handleEditTodo}
        handleRemoveTodo={handleRemoveTodo}
      />
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Todo
          </Typography>
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
          <Typography variant="h6" component="h2" gutterBottom>
            Confirm Remove
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography component="span" sx={{ fontWeight: 'bold', mr: 2 }}>{todos[removeIndex]?.title}</Typography>
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
      {/* Toast Notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenToast(false)}>
              <EmojiObjects fontSize="small" />
            </IconButton>
          }
        >
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ mr: 1 }} />
            Todo removed successfully!
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
