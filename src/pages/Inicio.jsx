import { Link } from 'react-router-dom';
import { resumen, tecnologias } from '../data/contenido.js';
import CardGrid from '../components/CardGrid.jsx';

export default function Inicio() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="etiqueta">PERFIL PROFESIONAL</p>
          <h2>
            Hola, soy <span>Jesús David Mercado</span>
          </h2>
          <p>
            Estudiante de Ingeniería de Software interesado en el desarrollo de software,
            programación, tecnología, Arduino y ciberseguridad.
          </p>

          <div className="tecnologias">
            {tecnologias.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <Link to="/sobre-mi" className="boton">
            Conocer más
          </Link>
        </div>

        <div className="hero-image">
          <img src="/img/perfil.png" alt="Foto de Jesús David Mercado" />
        </div>
      </section>

      <section className="resumen">
        <h2>// RESUMEN</h2>
        <CardGrid items={resumen} />
      </section>
    </>
  );
}
