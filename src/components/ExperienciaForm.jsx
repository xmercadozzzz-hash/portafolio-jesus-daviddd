import { useState } from 'react';

const VACIO = {
  cargo: '',
  empresa: '',
  ubicacion: '',
  fechaInicio: '',
  fechaFin: '',
  descripcion: '',
};

function validar(v, vigente) {
  const errores = {};
  if (!v.cargo.trim()) errores.cargo = 'Escribe el cargo.';
  if (!v.empresa.trim()) errores.empresa = 'Escribe la empresa.';
  if (!v.fechaInicio) errores.fechaInicio = 'Indica la fecha de inicio.';
  if (!vigente) {
    if (!v.fechaFin) errores.fechaFin = 'Indica la fecha de fin o marca "Trabajo aquí actualmente".';
    else if (v.fechaInicio && v.fechaFin < v.fechaInicio)
      errores.fechaFin = 'La fecha de fin no puede ser anterior al inicio.';
  }
  if (!v.descripcion.trim()) errores.descripcion = 'Describe tus funciones o logros.';
  return errores;
}

export default function ExperienciaForm({ inicial, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [vigente, setVigente] = useState(inicial ? !inicial.fechaFin : false);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  const cambiar = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validar(valores, vigente);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    setGuardando(true);
    setErrorApi('');
    try {
      await onGuardar({ ...valores, fechaFin: vigente ? '' : valores.fechaFin });
    } catch (err) {
      setErrorApi(err.message);
      setGuardando(false);
    }
  }

  const campo = (id, label, props = {}) => (
    <label className={errores[id] ? 'con-error' : ''}>
      {label}
      <input
        value={valores[id]}
        onChange={cambiar(id)}
        aria-invalid={Boolean(errores[id])}
        {...props}
      />
      {errores[id] && <span className="msg-error">{errores[id]}</span>}
    </label>
  );

  return (
    <form className="formulario" onSubmit={onSubmit} noValidate>
      {campo('cargo', 'Cargo', { type: 'text', maxLength: 120, autoFocus: true })}
      {campo('empresa', 'Empresa', { type: 'text', maxLength: 120 })}
      {campo('ubicacion', 'Ubicación (opcional)', { type: 'text', maxLength: 120 })}

      <div className="fila-doble">
        {campo('fechaInicio', 'Fecha de inicio', { type: 'date' })}
        {campo('fechaFin', 'Fecha de fin', { type: 'date', disabled: vigente })}
      </div>

      <label className="check">
        <input
          type="checkbox"
          checked={vigente}
          onChange={(e) => setVigente(e.target.checked)}
        />
        Trabajo aquí actualmente
      </label>

      <label className={errores.descripcion ? 'con-error' : ''}>
        Descripción
        <textarea
          rows={5}
          maxLength={1000}
          value={valores.descripcion}
          onChange={cambiar('descripcion')}
          aria-invalid={Boolean(errores.descripcion)}
        />
        {errores.descripcion && <span className="msg-error">{errores.descripcion}</span>}
      </label>

      {errorApi && (
        <p className="estado estado-error" role="alert">
          {errorApi}
        </p>
      )}

      <div className="acciones">
        <button type="button" className="boton boton-sec" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="boton" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar experiencia'}
        </button>
      </div>
    </form>
  );
}
