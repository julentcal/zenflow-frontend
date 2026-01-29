import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin }) {
    const { token, user, loading } = useAuth();

    // Mientras verificamos el token, mostramos un mensajito o nada
    if (loading) return <div>Cargando...</div>;

    // Si no hay token, te manda al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere ser Admin y el usuario NO lo es, te manda al inicio
    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, muestra la página
    return children;
}

export default ProtectedRoute;