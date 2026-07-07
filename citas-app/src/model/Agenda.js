let idAgendaSeq = 1;
let idHorarioSeq = 1;

export function ajustarSecuenciaAgenda(maxId) {
  idAgendaSeq = Math.max(idAgendaSeq, maxId + 1);
}
export function ajustarSecuenciaHorario(maxId) {
  idHorarioSeq = Math.max(idHorarioSeq, maxId + 1);
}

// 1 AgendaMedica -> 1..* HorarioAgenda (composición)
export class HorarioAgenda {
  constructor(fecha, hora) {
    this.idHorario = idHorarioSeq++;
    this.fecha = fecha; // 'YYYY-MM-DD'
    this.hora = hora; // 'HH:mm'
    this.disponible = true;
  }

  marcarDisponible() {
    this.disponible = true;
  }

  marcarOcupado() {
    this.disponible = false;
  }
}

// 1 Medico -> 1 AgendaMedica (composición)
export class AgendaMedica {
  constructor() {
    this.idAgenda = idAgendaSeq++;
    this.fechaRegistro = new Date().toISOString();
    this.horarios = []; // HorarioAgenda[]
  }

  // Genera (si no existen) los horarios de un día: 09:00-13:00 y
  // 15:00-18:00 en bloques de 30 minutos, todos disponibles.
  asegurarDia(fecha) {
    const yaExiste = this.horarios.some((h) => h.fecha === fecha);
    if (yaExiste) return;
    const bloques = [];
    const agregarRango = (inicioH, finH) => {
      for (let h = inicioH; h < finH; h++) {
        bloques.push(`${String(h).padStart(2, '0')}:00`);
        bloques.push(`${String(h).padStart(2, '0')}:30`);
      }
    };
    agregarRango(9, 13);
    agregarRango(15, 18);
    bloques.forEach((hora) => this.horarios.push(new HorarioAgenda(fecha, hora)));
  }

  obtenerHorariosDelDia(fecha) {
    this.asegurarDia(fecha);
    return this.horarios
      .filter((h) => h.fecha === fecha)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  verificarDisponibilidad(fecha, hora) {
    this.asegurarDia(fecha);
    const horario = this.horarios.find((h) => h.fecha === fecha && h.hora === hora);
    return Boolean(horario && horario.disponible);
  }

  reservarHorario(fecha, hora) {
    const horario = this.horarios.find((h) => h.fecha === fecha && h.hora === hora);
    if (horario) horario.marcarOcupado();
    return horario;
  }

  liberarHorario(fecha, hora) {
    const horario = this.horarios.find((h) => h.fecha === fecha && h.hora === hora);
    if (horario) horario.marcarDisponible();
    return horario;
  }
}
