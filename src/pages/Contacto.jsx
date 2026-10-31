import Seccion from '../components/Seccion.jsx';
import CardGrid from '../components/CardGrid.jsx';
import { contacto } from '../data/contenido.js';

export default function Contacto() {
  return (
    <Seccion etiqueta="// CONTACTO" titulo="Información de contacto">
      <p className="parrafo">
        Si deseas conocer más sobre mi perfil académico, mis conocimientos o mis proyectos, puedes
        comunicarte conmigo mediante los siguientes datos.
      </p>
      <CardGrid items={contacto} />
    </Seccion>
  );
}
