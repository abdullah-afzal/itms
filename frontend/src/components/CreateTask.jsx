import { useEffect, useState } from "react";
import { createTask, fetchUsers } from "../services/api";

function CreateTask({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const data = await fetchUsers();
            setUsers(data.users);
        } catch (err) {
            console.error("Failed to load users", err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !description.trim() || !userId) {
            setError("Title, description, and user are required");
            return;
        }

        try {
            const task = await createTask(title, description, userId);
            onTaskCreated(task);
            setTitle("");
            setDescription("");
            setUserId("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    gap: "3px",
                    alignItems: "center",
                    //   flexWrap: "wrap",
                }}
            >
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: "10px" }}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ padding: "3px", minWidth: "200px" }}
                />

                <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ padding: "10px", minWidth: "180px" }}
                >
                    <option value="">Assign User</option>
                    {users?.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                        </option>
                    ))}
                </select>

                <button type="submit" style={{ padding: "1px 15px" }}>
                    Add Task
                </button>
            </form>
        </>
    );
}

export default CreateTask;
