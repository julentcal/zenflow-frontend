import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() { 
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    const handleLogout = () => {
        logout(); 
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

                {user?.role === 'admin' && (
                    <NavLink 
                        to="/admin" 
                        className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                        style={{ color: '#ffd700', fontWeight: 'bold' }} 
                    >
                        👑 Admin
                    </NavLink>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
