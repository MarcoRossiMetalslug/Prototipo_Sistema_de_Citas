let idHistorialSeq = 1;
let idAtencionSeq = 1;

export function ajustarSecuenciaHistorial(maxId) {
  idHistorialSeq = Math.max(idHistorialSeq, maxId + 1);
}
export function ajustarSecuenciaAtencion(maxId) {
  idAtencionSeq = Math.max(idAtencionSeq, maxId + 1);
}

// 1 Paciente -> 1 HistorialClinico (composición)
// 1 HistorialClinico -> 1..* AtencionMedica (composición)
export class HistorialClinico {
  constructor(idPaciente) {
    this.idHistorial = idHistorialSeq++;
    this.idPaciente = idPaciente;
    this.fechaCreacion = new Date().toISOString();
    this.atenciones = []; // AtencionMedica[]
  }

  agregarAtencion(atencion) {
    this.atenciones.push(atencion);
  }

  listarAtenciones() {
    return [...this.atenciones].sort((a, b) => (a.fechaAtencion < b.fechaAtencion ? 1 : -1));
  }
}

export class AtencionMedica {
  constructor({ idCita, idPaciente, idMedico, sintomas, diagnostico, tratamiento, observaciones }) {
    this.idAtencion = idAtencionSeq++;
    this.idCita = idCita;
    this.idPaciente = idPaciente;
    this.idMedico = idMedico;
    this.sintomas = sintomas;
    this.diagnostico = diagnostico;
    this.tratamiento = tratamiento;
    this.observaciones = observaciones;
    this.fechaAtencion = new Date().toISOString();
    this.idReceta = null; // 1 AtencionMedica -> 0..1 RecetaMedica
  }

  registrarAtencion() {
    this.fechaAtencion = new Date().toISOString();
  }

  actualizarDiagnostico(nuevoDiagnostico) {
    this.diagnostico = nuevoDiagnostico;
  }
}
