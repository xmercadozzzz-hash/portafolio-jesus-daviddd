import { useEffect, useState } from 'react';
import Seccion from '../components/Seccion.jsx';
import { experienciaService } from '../services/experienciaService.js';
import { rangoFechas } from '../utils.js';

export default function Experiencia() {
  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | error
  const [error, setError] = useState('');

  useEffect(() => {
    const ctrl = new AbortController();
    experienciaService
      .listar(ctrl.signal)
      .then((data) => {
        setItems(data);
        setEstado('listo');
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e.message);
        setEstado('error');
      });
    return () => ctrl.abort();
  }, []);

  return (
    <Seccion etiqueta="// EXPERIENCIA" titulo="Experiencia profesional">
      {estado === 'cargando' && <p className="estado">Cargando experiencias…</p>}
      {estado === 'error' && (
        <p className="estado estado-error" role="alert">
          {error}
        </p>
      )}
      {estado === 'listo' && items.length === 0 && (
        <p className="estado">Todavía no hay experiencias registradas.</p>
      )}

      {estado === 'listo' && items.length > 0 && (
        <ol className="linea-tiempo">
          {items.map((e) => (
            <li className="exp" key={e.id}>
              <p className="exp-fechas">{rangoFechas(e.fechaInicio, e.fechaFin)}</p>
              <h3>{e.cargo}</h3>
              <p className="exp-empresa">
                {e.empresa}
                {e.ubicacion && ` · ${e.ubicacion}`}
              </p>
              <p className="exp-desc">{e.descripcion}</p>
            </li>
          ))}
        </ol>
      )}
    </Seccion>
  );
}
