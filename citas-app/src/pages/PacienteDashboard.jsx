import { useMemo, useState } from 'react';
import { useClinica } from '../context/ClinicaContext.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';

const HOY = new Date().toISOString().slice(0, 10);

export default function PacienteDashboard() {
  const { sistema, actor, version } = useClinica();
  const [tab, setTab] = useState('solicitar');

  return (
    <div className="panel">
      <div className="panel__tabs">
        <button className={tab === 'solicitar' ? 'is-active' : ''} onClick={() => setTab('solicitar')}>
          Solicitar cita
        </button>
        <button className={tab === 'citas' ? 'is-active' : ''} onClick={() => setTab('citas')}>
          Mis citas
        </button>
        <button className={tab === 'historial' ? 'is-active' : ''} onClick={() => setTab('historial')}>
          Mi historial clínico
        </button>
      </div>

      {tab === 'solicitar' && <SolicitarCita key={version} />}
      {tab === 'citas' && <MisCitas key={version} />}
      {tab === 'historial' && <MiHistorial key={version} />}
    </div>
  );

  function SolicitarCita() {
    const [idEspecialidad, setIdEspecialidad] = useState('');
    const [idMedico, setIdMedico] = useState('');
    const [fecha, setFecha] = useState(HOY);
    const [hora, setHora] = useState('');
    const [mensaje, setMensaje] = useState(null);

    const medicos = idEspecialidad ? sistema.listarMedicosPorEspecialidad(idEspecialidad) : [];
    const horarios = idMedico && fecha ? sistema.obtenerHorariosDisponibles(idMedico, fecha) : [];

    const solicitar = (e) => {
      e.preventDefault();
      const resultado = sistema.solicitarCita(
        { idPaciente: actor.idUsuario, idMedico: Number(idMedico), fecha, hora },
        actor
      );
      if (resultado.ok) {
        setMensaje({ tipo: 'ok', texto: `Cita #${resultado.cita.idCita} registrada como pendiente.` });
        setHora('');
      } else {
        setMensaje({ tipo: 'error', texto: resultado.error });
      }
    };

    return (
      <section className="tarjeta">
        <h2>Solicitar una nueva cita</h2>
        <p className="texto-suave">
          Elige la especialidad, el médico disponible, la fecha y un horario libre en su agenda.
        </p>
        <form className="formulario formulario--grid" onSubmit={solicitar}>
          <label>
            Especialidad
            <select
              value={idEspecialidad}
              onChange={(e) => {
                setIdEspecialidad(e.target.value);
                setIdMedico('');
                setHora('');
              }}
              required
            >
              <option value="">Selecciona una especialidad</option>
              {sistema.listarEspecialidades().map((esp) => (
                <option key={esp.idEspecialidad} value={esp.idEspecialidad}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Médico
            <select
              value={idMedico}
              onChange={(e) => {
                setIdMedico(e.target.value);
                setHora('');
              }}
              required
              disabled={!idEspecialidad}
            >
              <option value="">{idEspecialidad ? 'Selecciona un médico' : 'Elige antes una especialidad'}</option>
              {medicos.map((m) => (
                <option key={m.idUsuario} value={m.idUsuario}>
                  {m.nombreCompleto} · {m.cmp}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha
            <input
              type="date"
              min={HOY}
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setHora('');
              }}
              required
              disabled={!idMedico}
            />
          </label>

          <label>
            Horario disponible
            <select value={hora} onChange={(e) => setHora(e.target.value)} required disabled={!idMedico}>
              <option value="">{horarios.length ? 'Selecciona un horario' : 'Sin horarios libres ese día'}</option>
              {horarios.map((h) => (
                <option key={h.idHorario} value={h.hora}>
                  {h.hora}
                </option>
              ))}
            </select>
          </label>

          {mensaje && <p className={mensaje.tipo === 'ok' ? 'mensaje-ok span-2' : 'mensaje-error span-2'}>{mensaje.texto}</p>}

          <div className="span-2 formulario__acciones">
            <button className="btn btn--principal" type="submit" disabled={!hora}>
              Confirmar solicitud
            </button>
          </div>
        </form>
      </section>
    );
  }

  function MisCitas() {
    const citas = sistema.listarCitas({ idPaciente: actor.idUsuario });
    return (
      <section className="tarjeta">
        <h2>Mis citas</h2>
        {citas.length === 0 && <p className="vacio">Todavía no has solicitado ninguna cita.</p>}
        <div className="lista-citas">
          {citas.map((c) => {
            const medico = sistema.obtenerMedico(c.idMedico);
            const especialidad = sistema.obtenerEspecialidad(c.idEspecialidad);
            return (
              <div className="fila-cita" key={c.idCita}>
                <div className="fila-cita__fecha">
                  <strong>{c.fecha}</strong>
                  <span>{c.hora}</span>
                </div>
                <div className="fila-cita__info">
                  <strong>{especialidad?.nombre}</strong>
                  <span>{medico?.nombreCompleto}</span>
                </div>
                <EstadoBadge estado={c.estado} />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function MiHistorial() {
    const { atenciones } = sistema.obtenerHistorialCompleto(actor.idUsuario);
    return (
      <section className="tarjeta">
        <h2>Mi historial clínico</h2>
        {atenciones.length === 0 && (
          <p className="vacio">Aún no tienes atenciones médicas registradas.</p>
        )}
        <div className="lista-atenciones">
          {atenciones.map(({ atencion, medico, receta }) => (
            <article className="atencion-card" key={atencion.idAtencion}>
              <header>
                <strong>{new Date(atencion.fechaAtencion).toLocaleString('es-PE')}</strong>
                <span>{medico?.nombreCompleto}</span>
              </header>
              <dl>
                <dt>Síntomas</dt>
                <dd>{atencion.sintomas}</dd>
                <dt>Diagnóstico</dt>
                <dd>{atencion.diagnostico}</dd>
                <dt>Tratamiento</dt>
                <dd>{atencion.tratamiento}</dd>
                {atencion.observaciones && (
                  <>
                    <dt>Observaciones</dt>
                    <dd>{atencion.observaciones}</dd>
                  </>
                )}
              </dl>
              {receta && (
                <div className="receta-box">
                  <strong>Receta médica</strong>
                  <ul>
                    {receta.medicamentos.map((m) => (
                      <li key={m.idDetalle}>
                        {m.nombreMedicamento} — {m.dosis}, {m.frecuencia}, por {m.duracion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }
}
