console.log("register.js works!");
import { router } from "./routes.js";


const API_URL = "http://localhost:3000";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    console.log("Form submitted");
});
form.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
    const confirmPassword = formData.get("confirmPassword").trim();

    // Validar campos requeridos
    if (!name || !email || !username || !password || !confirmPassword) {
        alert("All fields must be filled");
        return;
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Verificar si el usuario ya existe
    try {
        const usernameCheck = await fetch(`${API_URL}/users?username=${username}`);
        const users = await usernameCheck.json();
        if (users.length > 0) {
            alert("Username already exists");
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
        
        // Redirigir a login usando el enrutador
        console.log("Redirigiendo a login...");
        console.log("Hash actual:", window.location.hash);
        window.location.hash = "login";
        console.log("Hash después de cambio:", window.location.hash);
        router();

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
    }
});

