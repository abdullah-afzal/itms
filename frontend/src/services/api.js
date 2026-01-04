const API_URL = process.env.REACT_APP_BACKEND_URL;

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function clearToken() {
    localStorage.removeItem("token");
}

export async function register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    return data;
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Login failed:", res.status, errorBody);
        throw new Error("Login failed");
    }

    const data = await res.json();
    setToken(data.token);
    return data;
}

export async function fetchTasks(query) {

    const token = getToken();
    if (!token) throw new Error("No token found. Please login.");

    const url = query ? `${API_URL}/tasks${query}` : `${API_URL}/tasks`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Fetch tasks failed:", res.status, errorBody);
        throw new Error("Failed to fetch tasks");
    }

    return res.json();
}

export async function createTask(title, description, userId) {
    const token = getToken();
    if (!token) throw new Error("No token found. Please login.");

    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, userId }),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Create task failed:", res.status, errorBody);
        throw new Error("Failed to create task");
    }

    return res.json();
}

export async function updateTask(id, body) {
    const token = getToken();
    if (!token) throw new Error("No token found. Please login.");

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Update task failed:", res.status, errorBody);
        throw new Error("Failed to update task");
    }

    return res.json();
}

export async function deleteTask(id) {
    const token = getToken();
    if (!token) throw new Error("No token found. Please login.");

    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Delete task failed:", res.status, errorBody);
        throw new Error("Failed to delete task");
    }

    return res.json();
}

export async function fetchUsers(){
     const token = getToken();
    if (!token) throw new Error("No token found. Please login.");

    const url = `${API_URL}/users`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Fetch users failed:", res.status, errorBody);
        throw new Error("Failed to fetch users");
    }

    return res.json();
}
