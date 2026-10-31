import { useCallback, useEffect, useState } from 'react';
import Seccion from '../../components/Seccion.jsx';
import Modal from '../../components/Modal.jsx';
import ExperienciaForm from '../../components/ExperienciaForm.jsx';
import { experienciaService } from '../../services/experienciaService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { rangoFechas } from '../../utils.js';

export default function Experiencias() {
  const { authEnabled, logout } = useAuth();

  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  // Modal de formulario: null = cerrado, {} = nueva, {...exp} = editar
  const [editando, setEditando] = useState(null);
  // Modal de confirmación de borrado
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      setItems(await experienciaService.listar());
      setEstado('listo');
    } catch (e) {
      setError(e.message);
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function guardar(valores) {
    if (editando?.id) {
      await experienciaService.actualizar(editando.id, valores);
      setAviso('Experiencia actualizada.');
    } else {
      await experienciaService.crear(valores);
      setAviso('Experiencia creada.');
    }
    setEditando(null);
    await cargar();
  }

  async function confirmarEliminar() {
    setEliminando(true);
    setErrorEliminar('');
    try {
      await experienciaService.eliminar(porEliminar.id);
      setAviso('Experiencia eliminada.');
      setPorEliminar(null);
      await cargar();
    } catch (e) {
      setErrorEliminar(e.message);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <Seccion etiqueta="// ADMINISTRACIÓN" titulo="Gestionar experiencias">
      <div className="barra-admin">
        <button className="boton" onClick={() => setEditando({})}>
          Nueva experiencia
        </button>
        {authEnabled && (
          <button className="boton boton-sec" onClick={logout}>
            Cerrar sesión
          </button>
        )}
      </div>

      <p className="aviso" role="status" aria-live="polite">
        {aviso}
      </p>

      {estado === 'cargando' && <p className="estado">Cargando experiencias…</p>}

      {estado === 'error' && (
        <div className="estado estado-error" role="alert">
          <p>{error}</p>
          <button className="boton boton-sec" onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && items.length === 0 && (
        <p className="estado">
          Aún no tienes experiencias. Usa “Nueva experiencia” para agregar la primera.
        </p>
      )}

      {estado === 'listo' && items.length > 0 && (
        <ul className="lista-admin">
          {items.map((e) => (
            <li className="fila-exp" key={e.id}>
              <div className="fila-info">
                <h3>{e.cargo}</h3>
                <p className="exp-empresa">
                  {e.empresa}
                  {e.ubicacion && ` · ${e.ubicacion}`}
                </p>
                <p className="exp-fechas">{rangoFechas(e.fechaInicio, e.fechaFin)}</p>
              </div>
              <div className="fila-acciones">
                <button
                  className="boton boton-sec boton-sm"
                  onClick={() => setEditando(e)}
                  aria-label={`Editar ${e.cargo} en ${e.empresa}`}
                >
                  Editar
                </button>
                <button
                  className="boton boton-peligro boton-sm"
                  onClick={() => {
                    setErrorEliminar('');
                    setPorEliminar(e);
                  }}
                  aria-label={`Eliminar ${e.cargo} en ${e.empresa}`}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        titulo={editando?.id ? 'Editar experiencia' : 'Nueva experiencia'}
      >
        {editando !== null && (
          <ExperienciaForm
            inicial={editando.id ? editando : undefined}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        )}
      </Modal>

      <Modal
        open={porEliminar !== null}
        onClose={() => setPorEliminar(null)}
        titulo="Eliminar experiencia"
      >
        {porEliminar && (
          <>
            <p className="parrafo">
              Se eliminará <strong>{porEliminar.cargo}</strong> en{' '}
              <strong>{porEliminar.empresa}</strong>. Esta acción no se puede deshacer.
            </p>
            {errorEliminar && (
              <p className="estado estado-error" role="alert">
                {errorEliminar}
              </p>
            )}
            <div className="acciones">
              <button
                className="boton boton-sec"
                onClick={() => setPorEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                className="boton boton-peligro"
                onClick={confirmarEliminar}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </Seccion>
  );
}
