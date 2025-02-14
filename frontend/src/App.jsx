import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login"; // Import your LoginPage
import ResetPasswordPage from "./pages/ResetPassword";
import RecoveryCodePage from "./pages/RecoveryCode";

function App() {

  return (
    <Router>
      <Routes>
        {/* Default Home Page */}
        <Route
          path="/"
          element={
            <>
              <Header />
              {/* Add a link to the login page */}
              <div className="flex w-full mt-4 justify-center items-center px-5">
                <div className="w-1/3 bg-white text-center text-accent border border-accent border-2 py-2 rounded-lg hover:bg-secondary">
                  <a href="/login" className="text-accent">Go to Login</a>
                </div>
              </div>
              {/* Add a link to the sign up page */}

              <div className="flex w-full mt-4 justify-center items-center px-5">
                <div
                  className="w-1/3 bg-accent text-center text-white border border-accent py-2 rounded-lg hover:bg-primary hover:border-primary"
                >
                  <a href="/signup" className="text-white">Go to Sign up</a>
                </div>
              </div>
            </>
          }
        />

        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryCodePage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
