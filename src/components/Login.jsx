import { useState } from 'react';
import { API_URL } from '../config';

export function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('ACCESS_TOKEN', data.access_token);
                onLoginSuccess(data.access_token);
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }

        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="login-card">
            <h2 style={{textAlign: 'center', border: 'none'}}>🔐 Iniciar Sesión</h2>
            
            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit} className="form-group">
                <input 
                    type="email" 
                    className="form-input"
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    className="form-input"
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">
                    Entrar
                </button>
            </form>
        </div>
    );
}