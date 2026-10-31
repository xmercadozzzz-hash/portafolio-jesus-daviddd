import { Link } from 'react-router-dom';
import Seccion from '../components/Seccion.jsx';

export default function NoEncontrada() {
  return (
    <Seccion etiqueta="// 404" titulo="Página no encontrada">
      <p className="parrafo">La dirección que buscas no existe o fue movida.</p>
      <Link to="/" className="boton">
        Volver al inicio
      </Link>
    </Seccion>
  );
}
