import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/user`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json' 
                    }
                });

                if (!response.ok) {
                    throw new Error("Token inválido o expirado");
                }

                const data = await response.json();
                setUser(data); 

            } catch (error) {
                // 👇 ESTA LÍNEA ES LA CLAVE PARA QUE NO SALGA EN ROJO
                console.error("Error de sesión:", error); 
                
                localStorage.removeItem('ACCESS_TOKEN');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('ACCESS_TOKEN', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;