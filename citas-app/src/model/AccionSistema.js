let idAccionSeq = 1;

export function ajustarSecuenciaAccion(maxId) {
  idAccionSeq = Math.max(idAccionSeq, maxId + 1);
}

// 1 Usuario -> 0..* AccionSistema (registra el responsable de cada
// acción importante: registrar pacientes, confirmar citas, registrar
// atenciones médicas, etc.)
export class AccionSistema {
  constructor({ idUsuario, usuario, rol, descripcion }) {
    this.idAccion = idAccionSeq++;
    this.idUsuario = idUsuario;
    this.usuario = usuario;
    this.rol = rol;
    this.descripcion = descripcion;
    this.fechaHora = new Date().toISOString();
  }

  registrar() {
    return this;
  }
}
