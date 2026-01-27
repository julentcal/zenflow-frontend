import { useEffect, useState } from 'react';
import { API_URL } from '../config';

export function YogaClassList({ token }) {
    const [classes, setClasses] = useState([]);
    const [selectedDateKey, setSelectedDateKey] = useState(null); 
    const [uniqueDays, setUniqueDays] = useState([]); 
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/classes`)
            .then(res => res.json())
            .then(data => {
                setClasses(data);
                
                const daysSet = new Set(data.map(c => {
                    return new Date(c.start_time).toISOString().split('T')[0];
                }));

                const sortedUniqueDays = [...daysSet].sort();
                
                setUniqueDays(sortedUniqueDays);

                if (sortedUniqueDays.length > 0) {
                    setSelectedDateKey(sortedUniqueDays[0]);
                }
            })
            .catch(err => {
                console.error(err);
                setError('No se pudieron cargar las clases');
            });
    }, []);

    const handleBook = async (classId, className) => {
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ yoga_class_id: classId })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ ¡ÉXITO! Reserva confirmada para: ${className}`);
            } else {
                alert('❌ Error al reservar: ' + (data.message || 'Inténtalo de nuevo'));
            }
        } catch (error) {
            console.error(error);
            alert('❌ Error de conexión');
        }
    };

   
    const getDisplayDate = (dateKey) => {
        if (!dateKey) return { dayName: '', dayNumber: '' };
        const date = new Date(dateKey);
        return {
            dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').toUpperCase(),
            dayNumber: date.getDate()
        };
    };


    const filteredClasses = classes.filter(c => c.start_time.startsWith(selectedDateKey));

    if (error) return <p className="error-msg">❌ {error}</p>;
    if (classes.length === 0) return <p style={{textAlign:'center', marginTop: 40}}>⌛ Cargando horarios...</p>;

    return (
        <div>
            <div className="date-selector">
                {uniqueDays.map(dateKey => {
                    const { dayName, dayNumber } = getDisplayDate(dateKey);
                    return (
                        <button 
                            key={dateKey}
                            className={`date-tab ${selectedDateKey === dateKey ? 'active' : ''}`}
                            onClick={() => setSelectedDateKey(dateKey)}
                        >
                            <span className="day-name">{dayName}</span>
                            <span className="day-number">{dayNumber}</span>
                        </button>
                    );
                })}
            </div>

            {/* 2. LISTA DE CLASES */}
            <div className="grid-layout">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map(c => (
                        <div key={c.id} className="card">
                            <div>
                                <h3 className="card-title">{c.name}</h3>
                                <div className="card-info">
                                    <span>🧘</span> {c.instructor_name}
                                </div>
                                <div className="card-info">
                                    <span>🕒</span> 
                                    {new Date(c.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {' '} | ⏳ {c.duration_minutes} min
                                </div>
                                <div className="card-info" style={{marginTop: 5, fontSize: '0.85em'}}>
                                    👥 Aforo: {c.capacity} pers.
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleBook(c.id, c.name)}
                                className="btn btn-primary"
                                style={{ marginTop: '20px' }}
                            >
                                Reservar Plaza
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{textAlign: 'center', width: '100%', color: '#888'}}>
                        No hay clases disponibles este día.
                    </p>
                )}
            </div>
        </div>
    );
}