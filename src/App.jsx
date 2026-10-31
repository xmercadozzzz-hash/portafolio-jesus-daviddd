import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Inicio from './pages/Inicio.jsx';
import SobreMi from './pages/SobreMi.jsx';
import Habilidades from './pages/Habilidades.jsx';
import Proyectos from './pages/Proyectos.jsx';
import Experiencia from './pages/Experiencia.jsx';
import Contacto from './pages/Contacto.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';
import Login from './pages/admin/Login.jsx';
import Experiencias from './pages/admin/Experiencias.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="sobre-mi" element={<SobreMi />} />
        <Route path="habilidades" element={<Habilidades />} />
        <Route path="proyectos" element={<Proyectos />} />
        <Route path="experiencia" element={<Experiencia />} />
        <Route path="contacto" element={<Contacto />} />

        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="experiencias" replace />} />
          <Route path="experiencias" element={<Experiencias />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
