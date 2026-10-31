import Seccion from '../components/Seccion.jsx';
import CardGrid from '../components/CardGrid.jsx';
import { habilidades } from '../data/contenido.js';

export default function Habilidades() {
  return (
    <Seccion etiqueta="// HABILIDADES" titulo="Mis conocimientos">
      <CardGrid items={habilidades} />
    </Seccion>
  );
}
