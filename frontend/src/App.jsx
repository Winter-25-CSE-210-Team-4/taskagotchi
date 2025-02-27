import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login'; // Import your LoginPage
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
<<<<<<< HEAD
import Header from './components/ui/Header';
=======
>>>>>>> f46aea2 (added mock auth context)

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home Page */}
        <Route path='/' element={<HomePage />} />
        {/* Login page Route */}
        <Route path='/login' element={<LoginPage />} />
        {/* Sign up Page Route */}
        <Route path='/signup' element={<SignupPage />} />
        {/* Home Page Route */}
        <Route path='/home' element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
