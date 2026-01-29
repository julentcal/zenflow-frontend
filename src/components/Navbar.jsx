import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- 1. Importamos el hook del contexto

export function Navbar() { // <--- 2. Ya no necesitamos recibir props
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // <--- 3. Sacamos usuario y logout del "aire"

    const handleLogout = () => {
        logout(); // Limpia el token usando la lógica del Contexto
        navigate('/'); 
    };

    return (
        <nav className="navbar">
            <div className="nav-tabs">
                <NavLink to="/" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`} end>
                    Horarios
                </NavLink>
                
                <NavLink to="/mis-reservas" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                    Mis Reservas
                </NavLink>

                <NavLink to="/comprar-bonos" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                    Mis Bonos
                </NavLink>

                {/* --- NUEVO: BOTÓN SOLO PARA ADMIN --- */}
                {/* Usamos 'user?.role' para evitar error si user es null momentáneamente */}
                {user?.role === 'admin' && (
                    <NavLink 
                        to="/admin" 
                        className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                        style={{ color: '#ffd700', fontWeight: 'bold' }} // Color dorado para destacar
                    >
                        👑 Admin
                    </NavLink>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Opcional: Mostrar saldo de bonos aquí también es muy útil */}
                {user && (
                    <span style={{ color: 'white', fontSize: '0.9em' }}>
                        Saldo: {user.credits}
                    </span>
                )}

                <button onClick={handleLogout} className="btn btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;