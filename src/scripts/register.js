console.log("register.js works!");
import { router } from "./routes.js";


const API_URL = "http://localhost:3000";

const form = document.getElementById("registerForm");


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
    const confirmPassword = formData.get("confirmPassword").trim();

    if (!name || !email || !username || !password || !confirmPassword) {
        alert("All fields must be filled");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Check if user already exists.
    try {
        const usernameCheck = await fetch(`${API_URL}/users?username=${username}`);
        const users = await usernameCheck.json();
        if (users.length > 0) {
            alert("Username already exists");
            return;
        }

        const emailCheck = await fetch(`${API_URL}/users?email=${email}`);
        const usersEmail = await emailCheck.json();
        if (usersEmail.length > 0) {
            alert("Email already exists")
            return;
        }

        // Crear nuevo usuario
        let role = "user"
        const newUser = { name, email, username, password, role};

        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        alert("User registered successfully!");
        form.reset();
        

        console.log("Redirecting to login...");
        console.log("Current Hash:", window.location.hash);
        window.location.hash = "#";
        console.log("Hash after the change:", window.location.hash);
        router();

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
    }
});

