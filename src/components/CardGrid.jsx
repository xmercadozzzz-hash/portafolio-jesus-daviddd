export default function CardGrid({ items }) {
  return (
    <div className="cards">
      {items.map((i) => (
        <article className="card" key={i.titulo}>
          <h3>{i.titulo}</h3>
          <p>{i.texto}</p>
        </article>
      ))}
    </div>
  );
}
