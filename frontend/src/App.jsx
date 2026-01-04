import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import { getToken } from "./services/api";
import AccountPage from "./pages/AccountPage";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/tasks" replace />
          ) : (
            <AccountPage setToken={setToken} />
          )
        }
      />
      {/* <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/tasks" replace />
          ) : (
            <LoginPage setToken={setToken} />
          )
        }
      /> */}

      <Route
        path="/tasks"
        element={
          token ? (
            <TasksPage setToken={setToken} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
