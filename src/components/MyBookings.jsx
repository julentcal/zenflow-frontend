import { useEffect, useState } from 'react';
import { API_URL } from '../config';

export function MyBookings({ token }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga para evitar errores visuales

    useEffect(() => {
        // DEFINIMOS LA FUNCIÓN DENTRO DEL EFFECT (Más seguro)
        const fetchBookings = async () => {
            try {
                const response = await fetch(`${API_URL}/my-bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                // COMPROBAMOS QUE SEA UN ARRAY antes de guardar
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    console.error("La API no devolvió una lista:", data);
                    // Si el token caducó, podríamos vaciar la lista
                    setBookings([]); 
                }
            } catch (err) {
                console.error("Error al cargar reservas:", err);
            } finally {
                setLoading(false); // Terminó de cargar (bien o mal)
            }
        };

        // LLAMAMOS A LA FUNCIÓN
        if (token) fetchBookings();
        
    }, [token]); // Se ejecuta cada vez que cambia el token

    const handleCancel = async (bookingId) => {
        if(!confirm('¿Seguro que quieres cancelar esta clase?')) return;

        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setBookings(bookings.filter(b => b.id !== bookingId));
                alert('Reserva cancelada correctamente');
            } else {
                alert('No se pudo cancelar la reserva');
            }

        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    // RENDERIZADO
    if (loading) return <p> Cargando tus reservas...</p>;
    if (bookings.length === 0) return <p> No tienes reservas todavía.</p>;

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>📅 Mis Reservas Confirmadas</h2>
            <ul className="booking-list">
                {bookings.map(booking => (
                    <li key={booking.id} className="booking-item">
                        <div>
                            {/* Usamos el operador ?. por si acaso booking.yoga_class no vino bien */}
                            <h3 className="card-title" style={{fontSize: '1.1em'}}>
                                {booking.yoga_class?.name || 'Clase no disponible'}
                            </h3>
                            <div className="card-info" style={{fontSize: '0.9em'}}>
                                <span>🧘 {booking.yoga_class?.instructor_name}</span>
                                <span style={{ margin: '0 10px' }}>|</span>
                                <span>🕒 {booking.yoga_class?.start_time ? new Date(booking.yoga_class.start_time).toLocaleDateString() : ''}</span>
                                <span className="badge-confirmed">Confirmada</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleCancel(booking.id)}
                            className="btn btn-danger"
                        >
                            Cancelar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}