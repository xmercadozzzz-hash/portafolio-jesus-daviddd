import { useEffect, useRef } from 'react';

/** Diálogo modal accesible basado en <dialog>. */
export default function Modal({ open, onClose, titulo, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-titulo"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="modal-cuerpo">
          <h3 id="modal-titulo">{titulo}</h3>
          {children}
        </div>
      )}
    </dialog>
  );
}
