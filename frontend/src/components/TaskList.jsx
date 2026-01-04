import { useEffect, useState } from "react";
import { fetchTasks, updateTask, deleteTask } from "../services/api";



const STATUS_TABS = ["PENDING", "IN_PROGRESS", "COMPLETED"];

function Tasks({ passed }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStatus, setActiveStatus] = useState("all");

    useEffect(() => {
        loadTasks(activeStatus);
    }, [activeStatus, passed]);


    const loadTasks = async (status) => {
        setLoading(true);
        try {
            const query = status && status !== "all" ? `?status=${status}` : "";
            const data = await fetchTasks(query);
            setTasks(data.tasks || []);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await updateTask(task.id, { ...task, status: newStatus });
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
            );
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    return (
        <div>
            <h2>Tasks</h2>


            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={() => setActiveStatus("all")}
                    style={{ fontWeight: activeStatus === "all" ? "bold" : "normal" }}
                >
                    All
                </button>
                {STATUS_TABS.map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        style={{ fontWeight: activeStatus === status ? "bold" : "normal" }}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "10px",
                        listStyle: "none",
                        padding: 0,
                        maxWidth: "100%"
                    }}
                >
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            style={{
                                border: "2px solid #ccc",
                                padding: "10px",
                                width: "300px",
                                boxSizing: "border-box",
                                borderRadius: "5px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>

<p style={{fontSize:"10px"}}>Assign to: {task.user.name}</p>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task, e.target.value)}
                                    style={{ flex: 1, padding: "5px" }}
                                >
                                    {STATUS_TABS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => handleDelete(task.id)}
                                    style={{ color: "red", padding: "5px 10px" }}
                                >
                                    Delete
                                </button>
                            </div>
                            
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}

export default Tasks;
