import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export function YogaClassList() {
    const { token, user } = useAuth(); 
    const navigate = useNavigate();
    
    const [classes, setClasses] = useState([]);
    const [selectedDateKey, setSelectedDateKey] = useState(null); 
    const [uniqueDays, setUniqueDays] = useState([]); 
    const [error, setError] = useState(null);

    useEffect(() => {

        const headers = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch(`${API_URL}/classes`, { headers })
        .then(res => res.json())
        .then(data => {
            setClasses(data);
            const daysSet = new Set(data.map(c => new Date(c.start_time).toISOString().split('T')[0]));
            const sortedUniqueDays = [...daysSet].sort();
            setUniqueDays(sortedUniqueDays);
            if (sortedUniqueDays.length > 0) setSelectedDateKey(sortedUniqueDays[0]);
        })
        .catch(err => {
            console.error(err);
            setError('No se pudieron cargar los horarios.');
        });


    }, [token]);

    const handleBook = async (classId) => {
        if (!user) {
            alert("Debes iniciar sesión");
            return;
        }

        const clase = classes.find(c => c.id === classId);
        if (clase && clase.credit_cost > 1) {
            const confirm = window.confirm(`Esta es una clase especial y costará ${clase.credit_cost} bonos. ¿Quieres continuar?`);
            if (!confirm) return;
        }

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
                alert(`¡ÉXITO! Reserva confirmada. Te quedan ${data.credits_left} bonos.`);
                window.location.reload(); 
            } else {
                alert('' + (data.message || 'Error al reservar'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    const handleBuyCredits = () => {
        navigate('/comprar-bonos'); 
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

    if (error) return <p className="error-msg"> {error}</p>;
    if (classes.length === 0) return <p className="loading-msg">Cargando horarios...</p>;

    const currentCredits = user ? user.credits : 0;

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

            <div className="grid-layout">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map(c => {
                        const spotsTaken = c.bookings_count || 0;
                        const spotsLeft = c.capacity - spotsTaken;
                        const isFull = spotsLeft <= 0;
                        const isBookedByMe = c.is_booked_by_user; 
                        
                        const creditCost = c.credit_cost || 1; 
                        
                        let btnClass = 'btn btn-primary';
                        let btnText = 'Reservar'; 
                        let isDisabled = false;
                        let statusClass = 'status-success'; 
                        let action = () => handleBook(c.id);

                        if (isBookedByMe) {
                            btnClass = 'btn btn-reserved';
                            btnText = 'Tu Plaza';
                            isDisabled = true;
                        } 
                        else if (isFull) {
                            btnClass = 'btn btn-full';
                            btnText = 'Completo';
                            isDisabled = true;
                            statusClass = 'status-full'; 
                        } 
                        else if (currentCredits < creditCost) {
                            btnClass = 'btn btn-action-buy'; 
                            btnText = `💳 Falta Saldo (${creditCost} créditos)`;
                            isDisabled = false; 
                            action = handleBuyCredits; 
                        }
                        else {
                            if (creditCost > 1) {
                                btnText = `Clase Especial (${creditCost} créditos)`;
                                btnClass = 'btn btn-special'; 
                            } else {
                                btnText = 'Reservar';
                            }
                        }

                        if (!isFull && !isBookedByMe && spotsLeft <= 3) {
                            statusClass = 'status-warning';
                        }

                        return (
                            <div key={c.id} className={`card ${creditCost > 1 ? 'card-special' : ''}`}>
                                <div>
                                    <h3 className="card-title">
                                        {c.name} 
                                        {creditCost > 1 && <span style={{fontSize: '0.8em', marginLeft:'5px'}}>✨</span>}
                                    </h3>
                                    <div className="card-info"><span>🧘</span> {c.instructor_name}</div>
                                    <div className="card-info">
                                        <span>🕒</span> 
                                        {new Date(c.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {' '} | ⏳ {c.duration_minutes} min
                                    </div>
                                    <div className={`status-text ${statusClass}`}>
                                        {isFull ? ' Clase Completa' : `👥 Quedan ${spotsLeft} plazas`}
                                    </div>
                                </div>
                                
                                <button onClick={action} className={btnClass} disabled={isDisabled}>
                                    {btnText}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="empty-msg">No hay clases programadas para este día.</p>
                )}
            </div>
        </div>
    );
}

export default YogaClassList;