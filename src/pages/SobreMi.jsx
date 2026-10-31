import Seccion from '../components/Seccion.jsx';
import { sobreMi } from '../data/contenido.js';

export default function SobreMi() {
  return (
    <Seccion etiqueta="// SOBRE MÍ" titulo="Mi perfil">
      {sobreMi.map((p, i) => (
        <p className="parrafo" key={i}>
          {p}
        </p>
      ))}
    </Seccion>
  );
}
