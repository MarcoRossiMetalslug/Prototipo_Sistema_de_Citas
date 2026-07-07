let idEspecialidadSeq = 1;

export function ajustarSecuenciaEspecialidad(maxId) {
  idEspecialidadSeq = Math.max(idEspecialidadSeq, maxId + 1);
}

export class Especialidad {
  constructor(nombre, descripcion) {
    this.idEspecialidad = idEspecialidadSeq++;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  // En el diagrama, listarMedicos() delega en la colección de médicos
  // del sistema; aquí recibe esa colección para no duplicar el estado.
  listarMedicos(todosLosMedicos) {
    return todosLosMedicos.filter((m) => m.idEspecialidad === this.idEspecialidad);
  }
}
