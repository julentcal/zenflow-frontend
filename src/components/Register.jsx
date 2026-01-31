import { useState } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                const message = data.message
                    || data.detail
                    || (data.errors ? Object.values(data.errors).flat().join(' ') : null)
                    || 'Error al registrarse';
                setError(message);
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="login-card">
            <h2 style={{ textAlign: 'center', border: 'none' }}>🧾 Crear Cuenta</h2>

            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit} className="form-group">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    className="form-input"
                    placeholder="Confirmar contraseña"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">
                    Crear cuenta
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button type="button" className="btn" onClick={() => navigate('/login')}>
                    Volver al login
                </button>
            </div>
        </div>
    );
}

export default Register;
