import { useState } from 'react';
import { ClinicaProvider, useClinica } from './context/ClinicaContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistroPacientePage from './pages/RegistroPacientePage.jsx';
import PacienteDashboard from './pages/PacienteDashboard.jsx';
import MedicoDashboard from './pages/MedicoDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function Contenido() {
  const { actor } = useClinica();
  const [pantalla, setPantalla] = useState('login'); // 'login' | 'registro'

  if (!actor) {
    return pantalla === 'registro' ? (
      <RegistroPacientePage onIrALogin={() => setPantalla('login')} />
    ) : (
      <LoginPage onIrARegistro={() => setPantalla('registro')} />
    );
  }

  if (actor.rol === 'Paciente') return <PacienteDashboard />;
  if (actor.rol === 'Medico') return <MedicoDashboard />;
  return <AdminDashboard />;
}

export default function App() {
  return (
    <ClinicaProvider>
      <div className="app">
        <Navbar />
        <main className="app__main">
          <Contenido />
        </main>
        <footer className="pie">
          Prototipo Sistema de Gestion de Citas - Clinica Santa Rita
        </footer>
      </div>
    </ClinicaProvider>
  );
}
