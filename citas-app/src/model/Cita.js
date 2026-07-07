// <<enumeration>> EstadoCita
export const EstadoCita = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  REPROGRAMADA: 'REPROGRAMADA',
  ATENDIDA: 'ATENDIDA',
  CANCELADA: 'CANCELADA',
});

export const EstadoCitaLabel = {
  [EstadoCita.PENDIENTE]: 'Pendiente',
  [EstadoCita.CONFIRMADA]: 'Confirmada',
  [EstadoCita.REPROGRAMADA]: 'Reprogramada',
  [EstadoCita.ATENDIDA]: 'Atendida',
  [EstadoCita.CANCELADA]: 'Cancelada',
};

let idCitaSeq = 1;

export function ajustarSecuenciaCita(maxId) {
  idCitaSeq = Math.max(idCitaSeq, maxId + 1);
}

export class CitaMedica {
  constructor({ idPaciente, idMedico, idEspecialidad, fecha, hora }) {
    this.idCita = idCitaSeq++;
    this.idPaciente = idPaciente;
    this.idMedico = idMedico;
    this.idEspecialidad = idEspecialidad;
    this.fecha = fecha;
    this.hora = hora;
    this.estado = EstadoCita.PENDIENTE;
    this.idAtencion = null; // se completa cuando el médico registra la atención
  }

  registrarPendiente() {
    this.estado = EstadoCita.PENDIENTE;
  }

  confirmar() {
    this.estado = EstadoCita.CONFIRMADA;
  }

  reprogramar(fecha, hora) {
    this.fecha = fecha;
    this.hora = hora;
    this.estado = EstadoCita.REPROGRAMADA;
  }

  cancelar() {
    this.estado = EstadoCita.CANCELADA;
  }

  marcarAtendida(idAtencion) {
    this.estado = EstadoCita.ATENDIDA;
    this.idAtencion = idAtencion;
  }
}
