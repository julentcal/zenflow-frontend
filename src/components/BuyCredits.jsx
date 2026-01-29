import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para el botón de volver
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

export function BuyCredits() {
    const { token, user } = useAuth(); // Obtenemos token y usuario del contexto
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Ya no necesitamos useEffect para cargar el usuario, lo tenemos en 'user'

    const handleBuy = async (packSize, price) => {
        if (!confirm(`¿Confirmar compra del Pack de ${packSize} clases por ${price}€?`)) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/buy-credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Usamos token del contexto
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ pack: packSize })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`🎉 ${data.message}\nTu nuevo saldo es: ${data.new_balance} bonos.`);
                // Recargamos la página para actualizar el contexto y el saldo visualmente
                window.location.reload();
            } else {
                alert('Error en la compra: ' + (data.detail || 'Inténtalo de nuevo'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <button className="nav-btn" onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
                ← Volver a Horarios
            </button>

            {/* BARRA DE SALDO LEÍDA DEL CONTEXTO */}
            <div className="user-balance-bar" style={{ margin: '0 auto 30px', maxWidth: '400px', justifyContent: 'center' }}>
                <span>Saldo actual:</span>
                {/* Si user existe mostramos créditos, si no 0 */}
                <span className="balance-count" style={{ marginLeft: '5px' }}>
                    {user ? user.credits : 0} créditos
                </span>
            </div>

            <div style={{textAlign: 'center', marginBottom: 40}}>
                <h1>Elige tu Pack</h1>
                <p style={{color: '#777'}}>Invierte en tu bienestar. Los bonos no caducan.</p>
            </div>

            <div className="grid-layout pricing-grid">
                {/* OPCIÓN 1: CLASE SUELTA */}
                <div className="card pricing-card">
                    <h3>Clase Suelta</h3>
                    <div className="price">15€</div>
                    <p className="description">Perfecto para probar.</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleBuy(1, 15)}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Comprar 1 Clase'}
                    </button>
                </div>

                {/* OPCIÓN 2: PACK 5 (Destacado) */}
                <div className="card pricing-card featured">
                    <div className="badge-popular">MÁS POPULAR</div>
                    <h3>Pack 5 Clases</h3>
                    <div className="price">65€</div>
                    <p className="description">Te ahorras 10€. Ideal para practicar una vez por semana.</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleBuy(5, 65)}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Comprar 5 Clases'}
                    </button>
                </div>

                {/* OPCIÓN 3: PACK 10 */}
                <div className="card pricing-card">
                    <h3>Pack 10 Clases</h3>
                    <div className="price">120€</div>
                    <p className="description">Para yoguis comprometidos. Precio más bajo por clase.</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleBuy(10, 120)}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Comprar 10 Clases'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyCredits;