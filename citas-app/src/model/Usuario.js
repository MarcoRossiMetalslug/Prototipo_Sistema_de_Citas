// =============================================================
// RELACIÓN UML IMPLEMENTADA: GENERALIZACIÓN (HERENCIA)
// =============================================================
// Caso de estudio: Sistema de Gestión de Citas Médicas.
// La clase "Usuario" es la superclase (clase padre) que agrupa
// los atributos y comportamientos comunes a todo actor del
// sistema que necesita autenticarse. Las clases "Paciente",
// "Medico" y "PersonalAdministrativo" son subclases que
// heredan de Usuario y añaden (o sobrescriben) su propio
// comportamiento especializado, tal como se modeló en el
// diagrama de clases (flechas de generalización con punta
// triangular vacía apuntando hacia "Usuario").
// =============================================================

let contadorId = 1;

export class Usuario {
  constructor(usuario, clave, rol) {
    if (new.target === Usuario) {
      throw new Error('Usuario es una clase base y no debe instanciarse directamente.');
    }
    this.idUsuario = contadorId++;
    this.usuario = usuario;
    this.clave = clave;
    this.rol = rol;
    this.sesionActiva = false;
    this.bitacora = [];
  }

  iniciarSesion() {
    this.sesionActiva = true;
    return this.registrarAccion(`${this.usuario} inició sesión como ${this.rol}`);
  }

  cerrarSesion() {
    this.sesionActiva = false;
    return this.registrarAccion(`${this.usuario} cerró sesión`);
  }

  registrarAccion(descripcion) {
    const accion = {
      idAccion: this.bitacora.length + 1,
      descripcion,
      fechaHora: new Date().toISOString(),
    };
    this.bitacora.push(accion);
    return accion;
  }

  // Método polimórfico: cada subclase lo sobrescribe para
  // exponer sus propias acciones de negocio (esto demuestra
  // que la generalización no solo comparte atributos, sino
  // que habilita polimorfismo real en el sistema).
  obtenerAccionesDisponibles() {
    return [];
  }

  obtenerFicha() {
    return {
      tipo: this.constructor.name,
      idUsuario: this.idUsuario,
      usuario: this.usuario,
      rol: this.rol,
    };
  }
}

export class Paciente extends Usuario {
  constructor({ usuario, clave, dni, nombres, apellidos, fechaNacimiento, telefono, correo, direccion }) {
    super(usuario, clave, 'Paciente');
    this.dni = dni;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.fechaNacimiento = fechaNacimiento;
    this.telefono = telefono;
    this.correo = correo;
    this.direccion = direccion;
    this.citas = [];
    this.historialClinico = [];
  }

  registrarse() {
    return this.registrarAccion(`Paciente ${this.nombres} ${this.apellidos} completó su registro`);
  }

  solicitarCita(especialidad, fecha, hora) {
    const cita = {
      idCita: this.citas.length + 1,
      especialidad,
      fecha,
      hora,
      estado: 'PENDIENTE',
    };
    this.citas.push(cita);
    this.registrarAccion(`Solicitó una cita de ${especialidad} para el ${fecha} ${hora}`);
    return cita;
  }

  consultarHistorial() {
    this.registrarAccion('Consultó su historial clínico');
    return this.historialClinico;
  }

  // Sobrescritura (polimorfismo) del método de la superclase
  obtenerAccionesDisponibles() {
    return ['registrarse()', 'solicitarCita()', 'consultarHistorial()'];
  }
}

export class Medico extends Usuario {
  constructor({ usuario, clave, cmp, nombres, apellidos, especialidad }) {
    super(usuario, clave, 'Medico');
    this.cmp = cmp;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.especialidad = especialidad;
    this.pacientesCitados = [];
  }

  verPacientesCitados() {
    this.registrarAccion('Consultó la lista de pacientes citados');
    return this.pacientesCitados;
  }

  registrarAtencion(cita, diagnostico, tratamiento) {
    const atencion = {
      idAtencion: this.pacientesCitados.length + 1,
      cita,
      diagnostico,
      tratamiento,
      fechaAtencion: new Date().toISOString(),
    };
    this.pacientesCitados.push(atencion);
    this.registrarAccion(`Registró la atención médica de la cita #${cita?.idCita ?? '-'}`);
    return atencion;
  }

  emitirReceta(atencion, medicamentos) {
    const receta = {
      idReceta: atencion?.idAtencion,
      medicamentos,
      fechaEmision: new Date().toISOString(),
    };
    this.registrarAccion('Emitió una receta médica');
    return receta;
  }

  // Sobrescritura (polimorfismo) del método de la superclase
  obtenerAccionesDisponibles() {
    return ['verPacientesCitados()', 'registrarAtencion()', 'emitirReceta()'];
  }
}

export class PersonalAdministrativo extends Usuario {
  constructor({ usuario, clave, codigoEmpleado, nombres }) {
    super(usuario, clave, 'PersonalAdministrativo');
    this.codigoEmpleado = codigoEmpleado;
    this.nombres = nombres;
  }

  confirmarCita(cita) {
    if (cita) cita.estado = 'CONFIRMADA';
    this.registrarAccion(`Confirmó la cita #${cita?.idCita ?? '-'}`);
    return cita;
  }

  reprogramarCita(cita, nuevaFecha, nuevaHora) {
    if (cita) {
      cita.fecha = nuevaFecha;
      cita.hora = nuevaHora;
      cita.estado = 'REPROGRAMADA';
    }
    this.registrarAccion(`Reprogramó la cita #${cita?.idCita ?? '-'} para ${nuevaFecha} ${nuevaHora}`);
    return cita;
  }

  cancelarCita(cita) {
    if (cita) cita.estado = 'CANCELADA';
    this.registrarAccion(`Canceló la cita #${cita?.idCita ?? '-'}`);
    return cita;
  }

  // Sobrescritura (polimorfismo) del método de la superclase
  obtenerAccionesDisponibles() {
    return ['confirmarCita()', 'reprogramarCita()', 'cancelarCita()'];
  }
}
