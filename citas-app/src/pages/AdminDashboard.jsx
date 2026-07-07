import { useState } from 'react';
import { useClinica } from '../context/ClinicaContext.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import Modal from '../components/Modal.jsx';
import { EstadoCita } from '../model/Cita.js';

const FILTRO_VACIO = { texto: '', idEspecialidad: '', idMedico: '', fecha: '', estado: '' };

export default function AdminDashboard() {
  const { sistema, actor, version } = useClinica();
  const [tab, setTab] = useState('citas');
  const [filtros, setFiltros] = useState(FILTRO_VACIO);
  const [citaAReprogramar, setCitaAReprogramar] = useState(null);

  const actualizarFiltro = (campo) => (e) => setFiltros((prev) => ({ ...prev, [campo]: e.target.value }));

  const citas = sistema.listarCitas({
    texto: filtros.texto || undefined,
    idEspecialidad: filtros.idEspecialidad || undefined,
    idMedico: filtros.idMedico || undefined,
    fecha: filtros.fecha || undefined,
    estado: filtros.estado || undefined,
  });

  const medicosFiltrados = filtros.idEspecialidad
    ? sistema.listarMedicosPorEspecialidad(filtros.idEspecialidad)
    : sistema.medicos;

  return (
    <div className="panel" key={version}>
      <div className="panel__tabs">
        <button className={tab === 'citas' ? 'is-active' : ''} onClick={() => setTab('citas')}>
          Todas las citas
        </button>
        <button className={tab === 'pacientes' ? 'is-active' : ''} onClick={() => setTab('pacientes')}>
          Pacientes registrados
        </button>
        <button className={tab === 'bitacora' ? 'is-active' : ''} onClick={() => setTab('bitacora')}>
          Bitácora del sistema
        </button>
      </div>

      {tab === 'citas' && (
        <section className="tarjeta">
          <h2>Citas programadas</h2>
          <div className="filtros">
            <input
              placeholder="Buscar por paciente o DNI…"
              value={filtros.texto}
              onChange={actualizarFiltro('texto')}
            />
            <select value={filtros.idEspecialidad} onChange={actualizarFiltro('idEspecialidad')}>
              <option value="">Todas las especialidades</option>
              {sistema.listarEspecialidades().map((e) => (
                <option key={e.idEspecialidad} value={e.idEspecialidad}>
                  {e.nombre}
                </option>
              ))}
            </select>
            <select value={filtros.idMedico} onChange={actualizarFiltro('idMedico')}>
              <option value="">Todos los médicos</option>
              {medicosFiltrados.map((m) => (
                <option key={m.idUsuario} value={m.idUsuario}>
                  {m.nombreCompleto}
                </option>
              ))}
            </select>
            <input type="date" value={filtros.fecha} onChange={actualizarFiltro('fecha')} />
            <select value={filtros.estado} onChange={actualizarFiltro('estado')}>
              <option value="">Todos los estados</option>
              {Object.values(EstadoCita).map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <button className="btn btn--fantasma btn--pequeno" onClick={() => setFiltros(FILTRO_VACIO)}>
              Limpiar filtros
            </button>
          </div>

          {citas.length === 0 && <p className="vacio">No hay citas que coincidan con los filtros.</p>}

          <div className="tabla-citas">
            {citas.map((c) => {
              const paciente = sistema.obtenerPaciente(c.idPaciente);
              const medico = sistema.obtenerMedico(c.idMedico);
              const especialidad = sistema.obtenerEspecialidad(c.idEspecialidad);
              const finalizada = c.estado === EstadoCita.CANCELADA || c.estado === EstadoCita.ATENDIDA;
              return (
                <div className="tabla-citas__fila" key={c.idCita}>
                  <div>
                    <strong>{c.fecha}</strong>
                    <span className="texto-suave"> {c.hora}</span>
                  </div>
                  <div>
                    <strong>{paciente?.nombreCompleto}</strong>
                    <span className="texto-suave"> DNI {paciente?.dni}</span>
                  </div>
                  <div>
                    <strong>{medico?.nombreCompleto}</strong>
                    <span className="texto-suave"> {especialidad?.nombre}</span>
                  </div>
                  <EstadoBadge estado={c.estado} />
                  <div className="tabla-citas__acciones">
                    <button
                      className="btn btn--pequeno btn--principal"
                      disabled={finalizada || c.estado === EstadoCita.CONFIRMADA}
                      onClick={() => sistema.confirmarCita(c.idCita, actor)}
                    >
                      Confirmar
                    </button>
                    <button
                      className="btn btn--pequeno btn--fantasma"
                      disabled={finalizada}
                      onClick={() => setCitaAReprogramar(c)}
                    >
                      Reprogramar
                    </button>
                    <button
                      className="btn btn--pequeno btn--peligro"
                      disabled={finalizada}
                      onClick={() => sistema.cancelarCita(c.idCita, actor)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'pacientes' && (
        <section className="tarjeta">
          <h2>Pacientes registrados ({sistema.pacientes.length})</h2>
          <div className="tabla-citas">
            {sistema.pacientes.map((p) => (
              <div className="tabla-citas__fila tabla-citas__fila--pacientes" key={p.idUsuario}>
                <div>
                  <strong>{p.nombreCompleto}</strong>
                  <span className="texto-suave"> DNI {p.dni}</span>
                </div>
                <div className="texto-suave">{p.correo}</div>
                <div className="texto-suave">{p.telefono}</div>
                <div className="texto-suave">{p.direccion}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'bitacora' && (
        <section className="tarjeta">
          <h2>Bitácora de acciones del sistema</h2>
          <p className="texto-suave">
            Cada acción importante (registrar pacientes, confirmar citas, registrar atenciones,
            emitir recetas…) queda asociada al usuario responsable, tal como exige el caso de
            estudio.
          </p>
          <div className="consola">
            {sistema.accionesSistema.map((a) => (
              <div className="consola__linea" key={a.idAccion}>
                <span className="consola__hora">{new Date(a.fechaHora).toLocaleTimeString('es-PE', { hour12: false })}</span>
                <span className={`consola__rol consola__rol--${a.rol}`}>{a.rol}</span>
                <span className="consola__actor">{a.usuario}</span>
                <span className="consola__texto">{a.descripcion}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {citaAReprogramar && (
        <ModalReprogramar cita={citaAReprogramar} onClose={() => setCitaAReprogramar(null)} />
      )}
    </div>
  );

  function ModalReprogramar({ cita, onClose }) {
    const [fecha, setFecha] = useState(cita.fecha);
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');
    const horarios = sistema.obtenerHorariosDisponibles(cita.idMedico, fecha);

    const guardar = (e) => {
      e.preventDefault();
      const resultado = sistema.reprogramarCita(cita.idCita, fecha, hora, actor);
      if (resultado.ok) onClose();
      else setError(resultado.error);
    };

    return (
      <Modal title={`Reprogramar cita #${cita.idCita}`} onClose={onClose} width={460}>
        <form className="formulario" onSubmit={guardar}>
          <label>
            Nueva fecha
            <input
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setHora('');
              }}
              required
            />
          </label>
          <label>
            Nuevo horario
            <select value={hora} onChange={(e) => setHora(e.target.value)} required>
              <option value="">{horarios.length ? 'Selecciona un horario' : 'Sin horarios libres ese día'}</option>
              {horarios.map((h) => (
                <option key={h.idHorario} value={h.hora}>
                  {h.hora}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="mensaje-error">{error}</p>}
          <div className="formulario__acciones">
            <button type="button" className="btn btn--fantasma" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--principal" disabled={!hora}>
              Guardar cambio
            </button>
          </div>
        </form>
      </Modal>
    );
  }
}
