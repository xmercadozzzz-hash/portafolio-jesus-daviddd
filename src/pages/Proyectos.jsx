import Seccion from '../components/Seccion.jsx';
import CardGrid from '../components/CardGrid.jsx';
import { proyectos } from '../data/contenido.js';

export default function Proyectos() {
  return (
    <Seccion etiqueta="// PROYECTOS" titulo="Proyectos y experiencias">
      <CardGrid items={proyectos} />
    </Seccion>
  );
}
