import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Navbar } from './components/NavBar';
import { Login } from './components/Login';
import { YogaClassList } from './components/YogaClassList';
import { MyBookings } from './components/MyBookings';
import { BuyCredits } from './components/BuyCredits';
import { AdminDashboard } from './components/AdminDashboard'; 

function App() {
  return (
    <AuthProvider>
        <div className="container">
            <h1>ZenFlow</h1>
            
            <Navbar /> 

            <Routes>
                <Route path="/login" element={<Login />} />            
                <Route path="/" element={<YogaClassList />} />
                <Route path="/mis-reservas" element={<MyBookings />} />
                <Route path="/comprar-bonos" element={<BuyCredits />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
        </div>
    </AuthProvider>
  );
}

export default App;