import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 1. IMPORTAMOS EL PROVEEDOR (LA "ANTENA")
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute'; // Asegúrate de tener este componente, si no, avísame

// Componentes
import { Navbar } from './components/NavBar';
import { Login } from './components/Login';
import { YogaClassList } from './components/YogaClassList';
import { MyBookings } from './components/MyBookings';
import { BuyCredits } from './components/BuyCredits';
import { AdminDashboard } from './components/AdminDashboard'; 
// Si tienes registro: import { Register } from './components/Register';

function App() {
  return (
    // 2. ENVOLVEMOS TODA LA APP EN EL AUTHPROVIDER
    // Así la Navbar y las páginas pueden acceder al usuario y al token
    <AuthProvider>
        <div className="container">
            <h1>ZenFlow</h1>
            
            {/* La Navbar ahora sí funcionará porque está DENTRO del Provider */}
            <Navbar /> 

            <Routes>
                {/* RUTA PÚBLICA */}
                <Route path="/login" element={<Login />} />
                
                {/* RUTAS PROTEGIDAS (Solo si estás logueado) */}
                {/* Si aún no has creado el archivo ProtectedRoute, usa el componente directo por ahora */}
                
                <Route path="/" element={<YogaClassList />} />
                <Route path="/mis-reservas" element={<MyBookings />} />
                <Route path="/comprar-bonos" element={<BuyCredits />} />

                {/* RUTA ADMIN */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;