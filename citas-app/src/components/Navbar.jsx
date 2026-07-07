import { useClinica } from '../context/ClinicaContext.jsx';

const ROL_LABEL = {
  Paciente: 'Paciente',
  Medico: 'Médico',
  PersonalAdministrativo: 'Personal administrativo',
};

export default function Navbar() {
  const { actor, cerrarSesion, reiniciarDemo } = useClinica();

  return (
    <header className="navbar">
      <div className="navbar__marca">
        <span className="navbar__cruz">✚</span>
        <div>
          <strong>Clínica Santa Rita</strong>
          <span className="navbar__sub">Gestión de citas y atención de pacientes</span>
        </div>
      </div>

      {actor && (
        <div className="navbar__sesion">
          <div className="navbar__usuario">
            <span className="navbar__rol">{ROL_LABEL[actor.rol] ?? actor.rol}</span>
            <strong>{actor.nombreCompleto ?? actor.nombres ?? actor.usuario}</strong>
          </div>
          <button className="btn btn--fantasma" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
      {!actor && (
        <button className="btn btn--fantasma btn--pequeno" onClick={reiniciarDemo} title="Borra los datos guardados en este navegador y vuelve a sembrar la demo">
          Reiniciar datos de la demo
        </button>
      )}
    </header>
  );
}
