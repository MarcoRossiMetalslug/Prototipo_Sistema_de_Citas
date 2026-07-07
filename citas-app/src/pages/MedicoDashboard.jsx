import { useState } from 'react';
import { useClinica } from '../context/ClinicaContext.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import Modal from '../components/Modal.jsx';
import { EstadoCita } from '../model/Cita.js';

const HOY = new Date().toISOString().slice(0, 10);
const MEDICAMENTO_VACIO = { nombreMedicamento: '', dosis: '', frecuencia: '', duracion: '' };

export default function MedicoDashboard() {
  const { sistema, actor, version } = useClinica();
  const [tab, setTab] = useState('agenda');
  const [citaEnAtencion, setCitaEnAtencion] = useState(null); // cita seleccionada para registrar atención
  const [ultimaAtencion, setUltimaAtencion] = useState(null); // para pasar a emitir receta

  const citasHoy = sistema.citasDeHoyPorMedico(actor.idUsuario);
  const citasPendientes = sistema.citasPendientesPorMedico(actor.idUsuario);

  return (
    <div className="panel" key={version}>
      <div className="panel__tabs">
        <button className={tab === 'agenda' ? 'is-active' : ''} onClick={() => setTab('agenda')}>
          Agenda de hoy
        </button>
        <button className={tab === 'todas' ? 'is-active' : ''} onClick={() => setTab('todas')}>
          Todas mis citas
        </button>
      </div>

      {tab === 'agenda' && (
        <section className="tarjeta">
          <h2>Pacientes citados hoy ({HOY})</h2>
          {citasHoy.length === 0 && <p className="vacio">No tienes pacientes citados para hoy.</p>}
          <div className="lista-citas">
            {citasHoy.map((c) => (
              <FilaPacienteCitado key={c.idCita} cita={c} onAtender={() => setCitaEnAtencion(c)} />
            ))}
          </div>
        </section>
      )}

      {tab === 'todas' && (
        <section className="tarjeta">
          <h2>Todas mis citas pendientes / confirmadas</h2>
          {citasPendientes.length === 0 && <p className="vacio">No tienes citas próximas.</p>}
          <div className="lista-citas">
            {citasPendientes.map((c) => (
              <FilaPacienteCitado key={c.idCita} cita={c} onAtender={() => setCitaEnAtencion(c)} />
            ))}
          </div>
        </section>
      )}

      {citaEnAtencion && (
        <ModalAtencion
          cita={citaEnAtencion}
          onClose={() => setCitaEnAtencion(null)}
          onRegistrada={(atencion) => {
            setCitaEnAtencion(null);
            setUltimaAtencion(atencion);
          }}
        />
      )}

      {ultimaAtencion && (
        <ModalReceta atencion={ultimaAtencion} onClose={() => setUltimaAtencion(null)} />
      )}
    </div>
  );

  function FilaPacienteCitado({ cita, onAtender }) {
    const paciente = sistema.obtenerPaciente(cita.idPaciente);
    return (
      <div className="fila-cita">
        <div className="fila-cita__fecha">
          <strong>{cita.fecha}</strong>
          <span>{cita.hora}</span>
        </div>
        <div className="fila-cita__info">
          <strong>{paciente?.nombreCompleto}</strong>
          <span>
            DNI {paciente?.dni} · Tel. {paciente?.telefono}
          </span>
        </div>
        <EstadoBadge estado={cita.estado} />
        <button
          className="btn btn--pequeno btn--principal"
          disabled={cita.estado === EstadoCita.ATENDIDA || cita.estado === EstadoCita.CANCELADA}
          onClick={onAtender}
        >
          {cita.estado === EstadoCita.ATENDIDA ? 'Ya atendida' : 'Atender'}
        </button>
      </div>
    );
  }

  function ModalAtencion({ cita, onClose, onRegistrada }) {
    const paciente = sistema.obtenerPaciente(cita.idPaciente);
    const [form, setForm] = useState({ sintomas: '', diagnostico: '', tratamiento: '', observaciones: '' });

    const campo = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

    const guardar = (e) => {
      e.preventDefault();
      const resultado = sistema.registrarAtencion({ idCita: cita.idCita, ...form }, actor);
      if (resultado.ok) onRegistrada(resultado.atencion);
    };

    return (
      <Modal title={`Registrar atención — ${paciente?.nombreCompleto}`} onClose={onClose} width={560}>
        <form className="formulario" onSubmit={guardar}>
          <label>
            Síntomas
            <textarea rows={2} value={form.sintomas} onChange={campo('sintomas')} required />
          </label>
          <label>
            Diagnóstico
            <textarea rows={2} value={form.diagnostico} onChange={campo('diagnostico')} required />
          </label>
          <label>
            Tratamiento indicado
            <textarea rows={2} value={form.tratamiento} onChange={campo('tratamiento')} required />
          </label>
          <label>
            Observaciones (opcional)
            <textarea rows={2} value={form.observaciones} onChange={campo('observaciones')} />
          </label>
          <div className="formulario__acciones">
            <button type="button" className="btn btn--fantasma" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--principal">
              Guardar atención
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  function ModalReceta({ atencion, onClose }) {
    const [indicaciones, setIndicaciones] = useState('');
    const [medicamentos, setMedicamentos] = useState([{ ...MEDICAMENTO_VACIO }]);
    const [emitida, setEmitida] = useState(false);

    const actualizarMedicamento = (idx, campo, valor) =>
      setMedicamentos((prev) => prev.map((m, i) => (i === idx ? { ...m, [campo]: valor } : m)));

    const agregarFila = () => setMedicamentos((prev) => [...prev, { ...MEDICAMENTO_VACIO }]);
    const quitarFila = (idx) => setMedicamentos((prev) => prev.filter((_, i) => i !== idx));

    const emitir = (e) => {
      e.preventDefault();
      const validos = medicamentos.filter((m) => m.nombreMedicamento.trim());
      if (validos.length === 0) return;
      sistema.emitirReceta({ idAtencion: atencion.idAtencion, indicaciones, medicamentos: validos }, actor);
      setEmitida(true);
    };

    return (
      <Modal title="Atención registrada · ¿Emitir receta médica?" onClose={onClose} width={620}>
        {emitida ? (
          <div>
            <p className="mensaje-ok">Receta médica emitida y asociada a la atención.</p>
            <div className="formulario__acciones">
              <button className="btn btn--principal" onClick={onClose}>
                Listo
              </button>
            </div>
          </div>
        ) : (
          <form className="formulario" onSubmit={emitir}>
            <label>
              Indicaciones generales (opcional)
              <textarea rows={2} value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} />
            </label>

            <div className="medicamentos">
              {medicamentos.map((m, idx) => (
                <div className="medicamentos__fila" key={idx}>
                  <input
                    placeholder="Medicamento"
                    value={m.nombreMedicamento}
                    onChange={(e) => actualizarMedicamento(idx, 'nombreMedicamento', e.target.value)}
                  />
                  <input
                    placeholder="Dosis"
                    value={m.dosis}
                    onChange={(e) => actualizarMedicamento(idx, 'dosis', e.target.value)}
                  />
                  <input
                    placeholder="Frecuencia"
                    value={m.frecuencia}
                    onChange={(e) => actualizarMedicamento(idx, 'frecuencia', e.target.value)}
                  />
                  <input
                    placeholder="Duración"
                    value={m.duracion}
                    onChange={(e) => actualizarMedicamento(idx, 'duracion', e.target.value)}
                  />
                  {medicamentos.length > 1 && (
                    <button type="button" className="btn-quitar" onClick={() => quitarFila(idx)} aria-label="Quitar">
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="enlace" onClick={agregarFila}>
              + Agregar medicamento
            </button>

            <div className="formulario__acciones">
              <button type="button" className="btn btn--fantasma" onClick={onClose}>
                Omitir receta
              </button>
              <button type="submit" className="btn btn--principal">
                Emitir receta
              </button>
            </div>
          </form>
        )}
      </Modal>
    );
  }
}
