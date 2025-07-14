console.log("login.js works!");
import { router } from "./routes.js";

const API_URL = "http://localhost:3000";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const username = formData.get("username").trim();
  const password = formData.get("password").trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    // Search for the user by username
    const response = await fetch(`${API_URL}/users?username=${username}`);
    const users = await response.json();

    if (users.length === 0) {
      alert("User not found.");
      return;
    }

    const user = users[0];

    // Validate password
    if (user.password !== password) {
      alert("Incorrect password.");
      return;
    }

    // Save session in localStorage including the role
    localStorage.setItem("loggedUser", JSON.stringify(user));

    alert(`Welcome, ${user.name}!`);
    
    // Redirect based on user role
    if (user.role === "admin") {
      window.location.hash = "dashboard";
    } else {
      window.location.hash = "notes";
    }
    router();

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Try again.");
  }
});
