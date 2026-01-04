import { useState } from "react";
import {
  clearToken,
  
} from "../services/api";
import TaskList from "../components/TaskList";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function TasksPage({setToken}) {
  const [tasks, setTasks] = useState(true);
  const navigate = useNavigate();

  async function loadTasks() {
    setTasks(!tasks);
  }

  function logout() {
    clearToken();      
    setToken(null);    
    navigate("/"); 
  }

  return (
    <>
      <Navbar onTaskCreated={loadTasks} onLogout={logout} />
      
      <TaskList passed={tasks} />
    </>
  );
}

export default TasksPage;
