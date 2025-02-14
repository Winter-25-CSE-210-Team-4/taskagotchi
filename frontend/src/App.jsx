import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/Login"; // Import your LoginPage
import HomePage from "./pages/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Default Home Page */}
        <Route
          path="/"
          element={
            <>
              {/* Add a link to the login page */}
              <a href="/login" className="text-blue-600 underline">Go to Login</a>
            </>
          }
        />
        
        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Home Page Route */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
