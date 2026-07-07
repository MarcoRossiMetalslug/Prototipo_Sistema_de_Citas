import { Paciente, Medico, PersonalAdministrativo, ajustarSecuenciaUsuario } from '../model/Usuario.js';
import { Especialidad, ajustarSecuenciaEspecialidad } from '../model/Especialidad.js';
import { AgendaMedica, HorarioAgenda, ajustarSecuenciaAgenda, ajustarSecuenciaHorario } from '../model/Agenda.js';
import { CitaMedica, EstadoCita, ajustarSecuenciaCita } from '../model/Cita.js';
import { HistorialClinico, AtencionMedica, ajustarSecuenciaHistorial, ajustarSecuenciaAtencion } from '../model/Clinico.js';
import { RecetaMedica, ajustarSecuenciaReceta, ajustarSecuenciaDetalle } from '../model/Receta.js';
import { AccionSistema, ajustarSecuenciaAccion } from '../model/AccionSistema.js';
import { ESPECIALIDADES_SEED, MEDICOS_SEED, ADMIN_SEED, PACIENTE_DEMO_SEED } from '../data/seed.js';

// =============================================================
// ClinicaSistema: raíz de agregación que reproduce, en memoria de
// ejecución (con respaldo en localStorage), todas las clases y
// relaciones del diagrama de "Sistema de Gestión de Citas y
// Atención de Pacientes". No es un backend real: es el "servidor"
// simulado del prototipo, pensado para correr tal cual en
// StackBlitz sin necesidad de configurar una base de datos.
// =============================================================

const STORAGE_KEY = 'clinica-santa-rita:v1';

export class ClinicaSistema {
  constructor() {
    this.especialidades = [];
    this.medicos = [];
    this.pacientes = [];
    this.personalAdministrativo = [];
    this.citas = [];
    this.historiales = []; // uno por paciente
    this.atenciones = [];
    this.recetas = [];
    this.accionesSistema = [];

    if (!this.cargar()) {
      this.sembrarDatosIniciales();
    }
  }

  // ---------- Persistencia simple en localStorage ----------
  guardar() {
    try {
      const snapshot = {
        especialidades: this.especialidades,
        medicos: this.medicos,
        pacientes: this.pacientes,
        personalAdministrativo: this.personalAdministrativo,
        citas: this.citas,
        historiales: this.historiales,
        atenciones: this.atenciones,
        recetas: this.recetas,
        accionesSistema: this.accionesSistema,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      // Si localStorage no está disponible (modo privado, iframe, etc.)
      // el prototipo simplemente continúa solo en memoria.
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }

  cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const datos = JSON.parse(raw);

      const revivir = (obj, Clase) => Object.assign(Object.create(Clase.prototype), obj);

      this.especialidades = (datos.especialidades || []).map((e) => revivir(e, Especialidad));
      this.medicos = (datos.medicos || []).map((m) => {
        const medico = revivir(m, Medico);
        medico.agenda = Object.assign(Object.create(AgendaMedica.prototype), m.agenda);
        medico.agenda.horarios = (m.agenda?.horarios || []).map((h) => revivir(h, HorarioAgenda));
        return medico;
      });
      this.pacientes = (datos.pacientes || []).map((p) => revivir(p, Paciente));
      this.personalAdministrativo = (datos.personalAdministrativo || []).map((a) =>
        revivir(a, PersonalAdministrativo)
      );
      this.citas = (datos.citas || []).map((c) => revivir(c, CitaMedica));
      this.historiales = (datos.historiales || []).map((h) => revivir(h, HistorialClinico));
      this.atenciones = (datos.atenciones || []).map((a) => revivir(a, AtencionMedica));
      this.recetas = (datos.recetas || []).map((r) => revivir(r, RecetaMedica));
      this.accionesSistema = (datos.accionesSistema || []).map((a) => revivir(a, AccionSistema));

      // Adelantamos todos los contadores de id para que, tras recargar la
      // página, los nuevos registros no reciclen un id ya persistido.
      const maxId = (arr, campo) => arr.reduce((max, item) => Math.max(max, item[campo] || 0), 0);
      ajustarSecuenciaUsuario(
        Math.max(
          maxId(this.pacientes, 'idUsuario'),
          maxId(this.medicos, 'idUsuario'),
          maxId(this.personalAdministrativo, 'idUsuario')
        )
      );
      ajustarSecuenciaEspecialidad(maxId(this.especialidades, 'idEspecialidad'));
      ajustarSecuenciaAgenda(maxId(this.medicos.map((m) => m.agenda), 'idAgenda'));
      ajustarSecuenciaHorario(maxId(this.medicos.flatMap((m) => m.agenda.horarios), 'idHorario'));
      ajustarSecuenciaCita(maxId(this.citas, 'idCita'));
      ajustarSecuenciaHistorial(maxId(this.historiales, 'idHistorial'));
      ajustarSecuenciaAtencion(maxId(this.atenciones, 'idAtencion'));
      ajustarSecuenciaReceta(maxId(this.recetas, 'idReceta'));
      ajustarSecuenciaDetalle(maxId(this.recetas.flatMap((r) => r.medicamentos), 'idDetalle'));
      ajustarSecuenciaAccion(maxId(this.accionesSistema, 'idAccion'));

      return this.medicos.length > 0;
    } catch (e) {
      console.warn('No se pudo restaurar el estado guardado, se reinicia el sistema:', e);
      return false;
    }
  }

  reiniciar() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* noop */
    }
    this.especialidades = [];
    this.medicos = [];
    this.pacientes = [];
    this.personalAdministrativo = [];
    this.citas = [];
    this.historiales = [];
    this.atenciones = [];
    this.recetas = [];
    this.accionesSistema = [];
    this.sembrarDatosIniciales();
  }

  sembrarDatosIniciales() {
    this.especialidades = ESPECIALIDADES_SEED.map(([nombre, descripcion]) => new Especialidad(nombre, descripcion));

    this.medicos = MEDICOS_SEED.map((datos) => {
      const especialidad = this.especialidades.find((e) => e.nombre === datos.especialidad);
      const medico = new Medico({ ...datos, idEspecialidad: especialidad.idEspecialidad });
      medico.agenda = new AgendaMedica();
      medico.idAgenda = medico.agenda.idAgenda;
      return medico;
    });

    this.personalAdministrativo = [new PersonalAdministrativo(ADMIN_SEED)];

    const pacienteDemo = new Paciente(PACIENTE_DEMO_SEED);
    this.pacientes = [pacienteDemo];
    this.historiales = [new HistorialClinico(pacienteDemo.idUsuario)];
    pacienteDemo.idHistorialClinico = this.historiales[0].idHistorial;

    this.registrarAccion(pacienteDemo, 'Cuenta de demostración creada durante la inicialización del sistema');
    this.guardar();
  }

  // ---------- Bitácora (AccionSistema) ----------
  registrarAccion(actor, descripcion) {
    const accion = new AccionSistema({
      idUsuario: actor?.idUsuario ?? null,
      usuario: actor?.usuario ?? 'sistema',
      rol: actor?.rol ?? 'Sistema',
      descripcion,
    });
    this.accionesSistema.unshift(accion);
    return accion;
  }

  // ---------- Autenticación ----------
  buscarUsuarioPorCredenciales(usuario, clave) {
    const todos = [...this.pacientes, ...this.medicos, ...this.personalAdministrativo];
    return todos.find((u) => u.usuario === usuario && u.clave === clave) || null;
  }

  usuarioExiste(usuario) {
    const todos = [...this.pacientes, ...this.medicos, ...this.personalAdministrativo];
    return todos.some((u) => u.usuario === usuario);
  }

  iniciarSesion(usuario, clave) {
    const actor = this.buscarUsuarioPorCredenciales(usuario, clave);
    if (!actor) return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    const descripcion = actor.iniciarSesion();
    this.registrarAccion(actor, descripcion);
    this.guardar();
    return { ok: true, actor };
  }

  cerrarSesion(actor) {
    if (!actor) return;
    const descripcion = actor.cerrarSesion();
    this.registrarAccion(actor, descripcion);
    this.guardar();
  }

  // ---------- Registro de paciente ----------
  registrarPaciente(datos) {
    if (this.usuarioExiste(datos.usuario)) {
      return { ok: false, error: 'Ese nombre de usuario ya existe. Elige otro.' };
    }
    if (this.pacientes.some((p) => p.dni === datos.dni)) {
      return { ok: false, error: 'Ya existe un paciente registrado con ese DNI.' };
    }
    const paciente = new Paciente(datos);
    const historial = new HistorialClinico(paciente.idUsuario);
    paciente.idHistorialClinico = historial.idHistorial;
    this.pacientes.push(paciente);
    this.historiales.push(historial);
    this.registrarAccion(paciente, paciente.registrarse());
    this.guardar();
    return { ok: true, actor: paciente };
  }

  // ---------- Especialidades y médicos ----------
  listarEspecialidades() {
    return this.especialidades;
  }

  listarMedicosPorEspecialidad(idEspecialidad) {
    const especialidad = this.especialidades.find((e) => e.idEspecialidad === Number(idEspecialidad));
    if (!especialidad) return [];
    return especialidad.listarMedicos(this.medicos);
  }

  obtenerEspecialidad(idEspecialidad) {
    return this.especialidades.find((e) => e.idEspecialidad === Number(idEspecialidad)) || null;
  }

  obtenerMedico(idMedico) {
    return this.medicos.find((m) => m.idUsuario === Number(idMedico)) || null;
  }

  obtenerPaciente(idPaciente) {
    return this.pacientes.find((p) => p.idUsuario === Number(idPaciente)) || null;
  }

  // ---------- Agenda / disponibilidad ----------
  obtenerHorariosDisponibles(idMedico, fecha) {
    const medico = this.obtenerMedico(idMedico);
    if (!medico) return [];
    return medico.agenda.obtenerHorariosDelDia(fecha).filter((h) => h.disponible);
  }

  verificarDisponibilidad(idMedico, fecha, hora) {
    const medico = this.obtenerMedico(idMedico);
    if (!medico) return false;
    return medico.agenda.verificarDisponibilidad(fecha, hora);
  }

  // ---------- Citas ----------
  solicitarCita({ idPaciente, idMedico, fecha, hora }, actorPaciente) {
    const medico = this.obtenerMedico(idMedico);
    if (!medico) return { ok: false, error: 'El médico seleccionado no existe.' };

    if (!medico.agenda.verificarDisponibilidad(fecha, hora)) {
      return { ok: false, error: 'Ese horario ya no está disponible. Elige otro.' };
    }

    medico.agenda.reservarHorario(fecha, hora);

    const cita = new CitaMedica({
      idPaciente,
      idMedico,
      idEspecialidad: medico.idEspecialidad,
      fecha,
      hora,
    });
    this.citas.push(cita);

    this.registrarAccion(actorPaciente, actorPaciente.solicitarCita() + ` (${medico.nombreCompleto}, ${fecha} ${hora})`);
    this.guardar();
    return { ok: true, cita };
  }

  listarCitas(filtros = {}) {
    return this.citas
      .filter((c) => {
        if (filtros.idPaciente && c.idPaciente !== Number(filtros.idPaciente)) return false;
        if (filtros.idMedico && c.idMedico !== Number(filtros.idMedico)) return false;
        if (filtros.idEspecialidad && c.idEspecialidad !== Number(filtros.idEspecialidad)) return false;
        if (filtros.fecha && c.fecha !== filtros.fecha) return false;
        if (filtros.estado && c.estado !== filtros.estado) return false;
        if (filtros.texto) {
          const paciente = this.obtenerPaciente(c.idPaciente);
          const texto = filtros.texto.toLowerCase();
          const coincide =
            paciente?.nombreCompleto.toLowerCase().includes(texto) || paciente?.dni?.includes(texto);
          if (!coincide) return false;
        }
        return true;
      })
      .sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1));
  }

  obtenerCita(idCita) {
    return this.citas.find((c) => c.idCita === Number(idCita)) || null;
  }

  confirmarCita(idCita, actorAdmin) {
    const cita = this.obtenerCita(idCita);
    if (!cita) return { ok: false, error: 'La cita no existe.' };
    const descripcion = actorAdmin.confirmarCita(cita);
    this.registrarAccion(actorAdmin, descripcion);
    this.guardar();
    return { ok: true, cita };
  }

  reprogramarCita(idCita, nuevaFecha, nuevaHora, actorAdmin) {
    const cita = this.obtenerCita(idCita);
    if (!cita) return { ok: false, error: 'La cita no existe.' };
    const medico = this.obtenerMedico(cita.idMedico);
    if (!medico.agenda.verificarDisponibilidad(nuevaFecha, nuevaHora)) {
      return { ok: false, error: 'Ese horario ya no está disponible.' };
    }
    medico.agenda.liberarHorario(cita.fecha, cita.hora);
    medico.agenda.reservarHorario(nuevaFecha, nuevaHora);
    const descripcion = actorAdmin.reprogramarCita(cita, nuevaFecha, nuevaHora);
    this.registrarAccion(actorAdmin, descripcion);
    this.guardar();
    return { ok: true, cita };
  }

  cancelarCita(idCita, actorAdmin) {
    const cita = this.obtenerCita(idCita);
    if (!cita) return { ok: false, error: 'La cita no existe.' };
    const medico = this.obtenerMedico(cita.idMedico);
    medico.agenda.liberarHorario(cita.fecha, cita.hora);
    const descripcion = actorAdmin.cancelarCita(cita);
    this.registrarAccion(actorAdmin, descripcion);
    this.guardar();
    return { ok: true, cita };
  }

  // ---------- Atención médica + historial + receta ----------
  registrarAtencion({ idCita, sintomas, diagnostico, tratamiento, observaciones }, actorMedico) {
    const cita = this.obtenerCita(idCita);
    if (!cita) return { ok: false, error: 'La cita no existe.' };

    const atencion = new AtencionMedica({
      idCita: cita.idCita,
      idPaciente: cita.idPaciente,
      idMedico: cita.idMedico,
      sintomas,
      diagnostico,
      tratamiento,
      observaciones,
    });
    this.atenciones.push(atencion);
    cita.marcarAtendida(atencion.idAtencion);

    const historial = this.historiales.find((h) => h.idPaciente === cita.idPaciente);
    if (historial) historial.agregarAtencion(atencion);

    this.registrarAccion(actorMedico, actorMedico.registrarAtencion() + ` (cita #${cita.idCita})`);
    this.guardar();
    return { ok: true, atencion };
  }

  emitirReceta({ idAtencion, indicaciones, medicamentos }, actorMedico) {
    const atencion = this.atenciones.find((a) => a.idAtencion === Number(idAtencion));
    if (!atencion) return { ok: false, error: 'La atención no existe.' };

    const receta = new RecetaMedica({ idAtencion: atencion.idAtencion, indicaciones });
    medicamentos.forEach((m) => receta.agregarMedicamento(m));
    this.recetas.push(receta);
    atencion.idReceta = receta.idReceta;

    this.registrarAccion(actorMedico, actorMedico.emitirReceta() + ` (atención #${atencion.idAtencion})`);
    this.guardar();
    return { ok: true, receta };
  }

  obtenerHistorialCompleto(idPaciente) {
    const historial = this.historiales.find((h) => h.idPaciente === Number(idPaciente));
    if (!historial) return { historial: null, atenciones: [] };
    const atenciones = historial.listarAtenciones().map((atencion) => {
      const medico = this.obtenerMedico(atencion.idMedico);
      const receta = this.recetas.find((r) => r.idAtencion === atencion.idAtencion) || null;
      return { atencion, medico, receta };
    });
    return { historial, atenciones };
  }

  citasDeHoyPorMedico(idMedico) {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.listarCitas({ idMedico, fecha: hoy }).filter((c) => c.estado !== EstadoCita.CANCELADA);
  }

  citasPendientesPorMedico(idMedico) {
    return this.listarCitas({ idMedico }).filter(
      (c) => c.estado !== EstadoCita.CANCELADA && c.estado !== EstadoCita.ATENDIDA
    );
  }
}
