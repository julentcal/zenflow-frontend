import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { API_URL } from '../config';

export function MyBookings() {
    const { token } = useAuth(); 
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchBookings = async () => {
            try {
                const response = await fetch(`${API_URL}/bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                } else {
                    setError('No se pudieron cargar las reservas.');
                }
            } catch (err) {
                console.error("Error cargando reservas:", err);
                setError('Error de conexión.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const handleCancel = async (bookingId) => {
        if (!confirm("¿Seguro que quieres cancelar esta reserva? Se te devolverá el bono.")) return;

        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBookings(bookings.filter(b => b.id !== bookingId));
                alert("Reserva cancelada y bono devuelto.");
                
            } else {
                const data = await response.json();
                alert(data.detail || "No se pudo cancelar.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }
    };

    if (loading) return <div className="loading-msg">⌛ Cargando tus reservas...</div>;
    if (error) return <div className="error-msg">❌ {error}</div>;

    return (
        <div className="animate-fade-in">
            <h2>Mis Reservas</h2>
            
            {bookings.length === 0 ? (
                <div className="empty-state">
                    <p>Aún no tienes reservas activas.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="card booking-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>
                                <h3>{booking.yoga_class?.name || "Clase de Yoga"}</h3>
                                <p>
                                    📅 {new Date(booking.yoga_class?.start_time).toLocaleDateString()} - 
                                    🕒 {new Date(booking.yoga_class?.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </p>
                                <p className="instructor-name">🧘 {booking.yoga_class?.instructor_name}</p>
                            </div>
                            
                            <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleCancel(booking.id)}
                                style={{border: '1px solid #ff4d4d', color: '#ff4d4d', background:'transparent'}}
                            >
                                Cancelar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings;