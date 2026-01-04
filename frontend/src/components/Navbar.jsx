import CreateTask from "./CreateTask";

function Navbar({ onTaskCreated, onLogout }) {
  return (
    <nav className="navbar" style={{alignItems:"center"}}>
      <h3>Internal Task Management System</h3>
      <CreateTask onTaskCreated={onTaskCreated} />
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
