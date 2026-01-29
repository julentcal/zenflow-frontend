import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export function AdminDashboard() {
    const { token, user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado del formulario para crear clase
    const [formData, setFormData] = useState({
        name: '',
        instructor_name: '',
        date: '',
        time: '',
        duration_minutes: 60,
        capacity: 20,
        credit_cost: 1
    });

    // 1. CARGAR CLASES AL ENTRAR
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch(`${API_URL}/classes`);
            const data = await res.json();
            // Ordenamos: primero las más nuevas (o futuras)
            setClasses(data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));
        } catch (error) {
            console.error("Error cargando clases:", error);
        }
    };

    // 2. MANEJAR EL FORMULARIO
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. CREAR NUEVA CLASE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Combinamos fecha y hora en formato ISO string: "2023-10-30T18:00:00"
        const start_time = `${formData.date}T${formData.time}:00`;

        const payload = {
            name: formData.name,
            instructor_name: formData.instructor_name,
            start_time: start_time,
            duration_minutes: parseInt(formData.duration_minutes),
            capacity: parseInt(formData.capacity),
            credit_cost: parseInt(formData.credit_cost)
        };

        try {
            const response = await fetch(`${API_URL}/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('✅ Clase creada correctamente');
                fetchClasses(); // Recargamos la lista
                // Limpiamos el form (opcional, dejamos instructor y capacidad por comodidad)
                setFormData({ ...formData, name: '', date: '', time: '' }); 
            } else {
                const errorData = await response.json();
                alert(' Error: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error("Error creando clase:", error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // 4. BORRAR CLASE
    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que quieres borrar esta clase? Se cancelarán las reservas asociadas.")) return;

        try {
            const response = await fetch(`${API_URL}/classes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setClasses(classes.filter(c => c.id !== id));
            } else {
                alert("No se pudo borrar la clase.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Si no es admin, no mostramos nada (seguridad extra visual)
    if (!user || user.role !== 'admin') {
        return <div className="container"><h2>⛔ Acceso denegado</h2></div>;
    }

    return (
        <div className="admin-container animate-fade-in">
            <h1>Panel de Administración 🛠️</h1>
            
            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* COLUMNA IZQUIERDA: CREAR CLASE */}
                <div className="card">
                    <h2>📅 Crear Nueva Clase</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Nombre de la Clase:</label>
                            <input 
                                type="text" name="name" required 
                                placeholder="Ej: Vinyasa Flow"
                                value={formData.name} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Instructor:</label>
                            <input 
                                type="text" name="instructor_name" required 
                                placeholder="Ej: María"
                                value={formData.instructor_name} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-row" style={{display:'flex', gap:'10px'}}>
                            <div className="form-group" style={{flex:1}}>
                                <label>Fecha:</label>
                                <input 
                                    type="date" name="date" required 
                                    value={formData.date} onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group" style={{flex:1}}>
                                <label>Hora:</label>
                                <input 
                                    type="time" name="time" required 
                                    value={formData.time} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="form-row" style={{display:'flex', gap:'10px'}}>
                            <div className="form-group">
                                <label>Duración (min):</label>
                                <input 
                                    type="number" name="duration_minutes" required 
                                    value={formData.duration_minutes} onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Capacidad:</label>
                                <input 
                                    type="number" name="capacity" required 
                                    value={formData.capacity} onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Coste (bonos):</label>
                                <input 
                                    type="number" name="credit_cost" required 
                                    value={formData.credit_cost} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%', marginTop:'10px'}}>
                            {loading ? 'Creando...' : '➕ Publicar Clase'}
                        </button>
                    </form>
                </div>

                {/* COLUMNA DERECHA: LISTA DE CLASES */}
                <div className="card">
                    <h2>📋 Clases Activas ({classes.length})</h2>
                    <div className="admin-class-list" style={{maxHeight: '500px', overflowY: 'auto'}}>
                        {classes.length === 0 ? <p>No hay clases creadas.</p> : (
                            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                <thead>
                                    <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
                                        <th>Fecha</th>
                                        <th>Clase</th>
                                        <th>Reservas</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map(cls => (
                                        <tr key={cls.id} style={{borderBottom:'1px solid #eee'}}>
                                            <td style={{padding:'10px 0'}}>
                                                {new Date(cls.start_time).toLocaleDateString()}<br/>
                                                <small>{new Date(cls.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                                            </td>
                                            <td>
                                                <strong>{cls.name}</strong><br/>
                                                <small>{cls.instructor_name}</small>
                                            </td>
                                            <td>
                                                {cls.bookings_count} / {cls.capacity}
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(cls.id)}
                                                    className="btn"
                                                    style={{backgroundColor: '#ff4d4d', color:'white', padding: '5px 10px', fontSize:'0.8em'}}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;