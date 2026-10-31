export default function Seccion({ etiqueta, titulo, children }) {
  return (
    <section className="resumen">
      {etiqueta && <p className="etiqueta">{etiqueta}</p>}
      {titulo && <h2>{titulo}</h2>}
      {children}
    </section>
  );
}
