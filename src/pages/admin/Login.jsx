import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Seccion from '../../components/Seccion.jsx';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from || '/admin/experiencias';

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (isAuthenticated) return <Navigate to={destino} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(usuario, clave);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.status === 401 ? 'Usuario o contraseña incorrectos.' : err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Seccion etiqueta="// ADMINISTRACIÓN" titulo="Iniciar sesión">
      <form className="formulario formulario-login" onSubmit={onSubmit}>
        <label>
          Correo
          <input
            type="email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="estado estado-error" role="alert">
            {error}
          </p>
        )}

        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </Seccion>
  );
}
