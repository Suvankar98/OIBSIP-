// Constants
const ROUTES = {
  LOGIN: "login.html",
  DASHBOARD: "dashboard.html",
};

// Input validation
const validateForm = (data) => {
  const errors = {};
  if (!data.username || data.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (!data.email || !data.email.includes("@")) {
    errors.email = "Valid email is required";
  }
  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Registration form submission
document
  .getElementById("registration-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      username: document.getElementById("username")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      password: document.getElementById("password")?.value,
    };

    const validation = validateForm(formData);
    if (!validation.isValid) {
      alert(Object.values(validation.errors).join("\n"));
      return;
    }

    try {
      // In real app, use secure API call instead of localStorage
      const hashedPassword = await hashPassword(formData.password);
      sessionStorage.setItem("username", formData.username);
      sessionStorage.setItem("email", formData.email);
      sessionStorage.setItem("hashedPassword", hashedPassword);

      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  });

// Login form submission
document
  .getElementById("login-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const storedUsername = sessionStorage.getItem("username");
      const storedHashedPassword = sessionStorage.getItem("hashedPassword");

      const hashedInputPassword = await hashPassword(password);

      if (
        username === storedUsername &&
        hashedInputPassword === storedHashedPassword
      ) {
        // Set session token (in real app, get from backend)
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = ROUTES.DASHBOARD;
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  });

// Mock password hashing (replace with proper hashing in production)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function displayUsername() {
  const usernameElement = document.getElementById("username");
  if (usernameElement) {
    const username = sessionStorage.getItem("username");
    if (username) {
      usernameElement.textContent = username;
    } else {
      window.location.href = ROUTES.LOGIN;
    }
  }
}

// Check login status and display username
if (window.location.pathname.includes("dashboard.html")) {
  if (!sessionStorage.getItem("isLoggedIn")) {
    window.location.href = ROUTES.LOGIN;
  } else {
    displayUsername();
  }
}

// Logout button redirect to registration page
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
}
