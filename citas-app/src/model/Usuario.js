// =============================================================
// RELACIÓN UML: GENERALIZACIÓN (HERENCIA)
// =============================================================
// "Usuario" es la superclase: concentra credenciales (idUsuario,
// usuario, clave, rol) y el comportamiento común de autenticación.
// "Paciente", "Medico" y "PersonalAdministrativo" heredan de ella
// (flecha de generalización, punta triangular vacía) y añaden su
// propio comportamiento especializado, tal como en el diagrama.
// =============================================================

let idUsuarioSeq = 1;

// Al restaurar datos persistidos (localStorage) hay que "adelantar" el
// contador para que los nuevos registros no reciclen un id ya usado.
export function ajustarSecuenciaUsuario(maxId) {
  idUsuarioSeq = Math.max(idUsuarioSeq, maxId + 1);
}

export class Usuario {
  constructor(usuario, clave, rol) {
    if (new.target === Usuario) {
      throw new Error('Usuario es una clase base y no debe instanciarse directamente.');
    }
    this.idUsuario = idUsuarioSeq++;
    this.usuario = usuario;
    this.clave = clave;
    this.rol = rol;
    this.sesionActiva = false;
  }

  // Devuelve la descripción de la acción; quien la ejecuta decide
  // cómo registrarla en AccionSistema (lo hace el store central,
  // para poder asociar también el idUsuario responsable).
  iniciarSesion() {
    this.sesionActiva = true;
    return `${this.usuario} inició sesión como ${this.rol}`;
  }

  cerrarSesion() {
    this.sesionActiva = false;
    return `${this.usuario} cerró sesión`;
  }

  obtenerFicha() {
    return { tipo: this.constructor.name, idUsuario: this.idUsuario, usuario: this.usuario, rol: this.rol };
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
    this.idHistorialClinico = null; // 1 Paciente -> 1 HistorialClinico (composición)
  }

  registrarse() {
    return `Paciente ${this.nombres} ${this.apellidos} completó su registro (DNI ${this.dni})`;
  }

  solicitarCita() {
    return `${this.nombres} ${this.apellidos} solicitó una cita médica`;
  }

  consultarHistorial() {
    return `${this.nombres} ${this.apellidos} consultó su historial clínico`;
  }

  get nombreCompleto() {
    return `${this.nombres} ${this.apellidos}`;
  }
}

export class Medico extends Usuario {
  constructor({ usuario, clave, cmp, nombres, apellidos, idEspecialidad }) {
    super(usuario, clave, 'Medico');
    this.cmp = cmp;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.idEspecialidad = idEspecialidad; // agregación: 1 Especialidad -> 0..* Medico
    this.idAgenda = null; // composición: 1 Medico -> 1 AgendaMedica
  }

  verPacientesCitados() {
    return `Dr(a). ${this.apellidos} consultó su lista de pacientes citados`;
  }

  registrarAtencion() {
    return `Dr(a). ${this.apellidos} registró una atención médica`;
  }

  emitirReceta() {
    return `Dr(a). ${this.apellidos} emitió una receta médica`;
  }

  get nombreCompleto() {
    return `Dr(a). ${this.nombres} ${this.apellidos}`;
  }
}

// Implementa <<interface>> IGestionCitas: confirmarCita(cita),
// reprogramarCita(cita, fecha, hora), cancelarCita(cita)
export class PersonalAdministrativo extends Usuario {
  constructor({ usuario, clave, codigoEmpleado, nombres }) {
    super(usuario, clave, 'PersonalAdministrativo');
    this.codigoEmpleado = codigoEmpleado;
    this.nombres = nombres;
  }

  confirmarCita(cita) {
    cita.confirmar();
    return `${this.nombres} confirmó la cita #${cita.idCita}`;
  }

  reprogramarCita(cita, fecha, hora) {
    cita.reprogramar(fecha, hora);
    return `${this.nombres} reprogramó la cita #${cita.idCita} para ${fecha} ${hora}`;
  }

  cancelarCita(cita) {
    cita.cancelar();
    return `${this.nombres} canceló la cita #${cita.idCita}`;
  }
}
