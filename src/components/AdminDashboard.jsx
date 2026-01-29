import { useState } from 'react';
import { API_URL } from '../config';

export function AdminDashboard({ token }) {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        name: '',
        instructor_name: '',
        date: '',
        time: '',
        duration_minutes: 60,
        capacity: 15,
        credit_cost: 1, // Por defecto 1
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combinar fecha y hora para el formato de MySQL (YYYY-MM-DD HH:MM:SS)
        const fullDateTime = `${formData.date} ${formData.time}:00`;

        const payload = {
            ...formData,
            start_time: fullDateTime
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

            const data = await response.json();

            if (response.ok) {
                alert('✅ Clase creada correctamente');
                // Limpiar form o redirigir
                setFormData({...formData, name: '', description: ''}); // Limpia lo básico
            } else {
                alert('❌ Error: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Panel de Administración</h2>
            <div className="card">
                <h3>Crear Nueva Clase</h3>
                <form onSubmit={handleSubmit} className="admin-form">
                    
                    <div className="form-group">
                        <label>Nombre de la Clase:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Vinyasa Flow" />
                    </div>

                    <div className="form-group">
                        <label>Instructor:</label>
                        <input type="text" name="instructor_name" value={formData.instructor_name} onChange={handleChange} required placeholder="Ej: Julia" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha:</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Hora:</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Duración (min):</label>
                            <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Aforo Máx:</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group highlight-box">
                        <label>💎 Coste en Créditos:</label>
                        <select name="credit_cost" value={formData.credit_cost} onChange={handleChange}>
                            <option value="1">1 Bono (Clase Normal)</option>
                            <option value="4">4 Bonos (Clase Especial/Taller)</option>
                            <option value="2">2 Bonos (Intermedio)</option>
                        </select>
                        <small>Selecciona 4 para eventos especiales de domingo.</small>
                    </div>

                    <button type="submit" className="btn btn-primary full-width">Publicar Clase</button>
                </form>
            </div>
        </div>
    );
}