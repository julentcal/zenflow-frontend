import { useState } from 'react';
import './App.css'; 
import { YogaClassList } from './components/YogaClassList';
import { Login } from './components/Login';
import { MyBookings } from './components/MyBookings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [view, setView] = useState('classes');

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    setToken(null);
    setView('classes');
  };

  return (
    <div className="container">
      <h1>ZenFlow</h1>

      {!token ? (
        <Login onLoginSuccess={setToken} />
      ) : (
        <>
          <div className="navbar">
            <div className="nav-tabs">
                <button 
                    className={`nav-btn ${view === 'classes' ? 'active' : ''}`} 
                    onClick={() => setView('classes')}
                >
                    Ver Clases
                </button>
                <button 
                    className={`nav-btn ${view === 'bookings' ? 'active' : ''}`} 
                    onClick={() => setView('bookings')}
                >
                    Mis Reservas
                </button>
            </div>
            
            <button onClick={handleLogout} className="btn btn-logout">
              Cerrar Sesión
            </button>
          </div>
          
          {view === 'classes' ? (
              <YogaClassList token={token} />
          ) : (
              <MyBookings token={token} />
          )}
        </>
      )}
    </div>
  );
}

export default App;