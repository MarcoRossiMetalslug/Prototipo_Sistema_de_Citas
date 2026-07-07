export const ESPECIALIDADES_SEED = [
  ['Medicina General', 'Atención primaria, chequeos generales y derivaciones.'],
  ['Pediatría', 'Salud y desarrollo de niñas, niños y adolescentes.'],
  ['Dermatología', 'Diagnóstico y tratamiento de piel, cabello y uñas.'],
  ['Ginecología', 'Salud reproductiva y ginecológica de la mujer.'],
  ['Cardiología', 'Prevención y tratamiento de enfermedades del corazón.'],
  ['Traumatología', 'Lesiones y afecciones del sistema musculoesquelético.'],
];

// { usuario, clave, cmp, nombres, apellidos, especialidad(nombre) }
export const MEDICOS_SEED = [
  { usuario: 'dr.rios', clave: 'medico123', cmp: 'CMP-10234', nombres: 'Andrés', apellidos: 'Ríos Palacios', especialidad: 'Medicina General' },
  { usuario: 'dra.flores', clave: 'medico123', cmp: 'CMP-11987', nombres: 'Mariela', apellidos: 'Flores Quispe', especialidad: 'Pediatría' },
  { usuario: 'dr.salinas', clave: 'medico123', cmp: 'CMP-12455', nombres: 'Jorge', apellidos: 'Salinas Vidal', especialidad: 'Dermatología' },
  { usuario: 'dra.cano', clave: 'medico123', cmp: 'CMP-13720', nombres: 'Patricia', apellidos: 'Cano Ibáñez', especialidad: 'Ginecología' },
  { usuario: 'dr.torres', clave: 'medico123', cmp: 'CMP-55210', nombres: 'Ricardo', apellidos: 'Torres Vega', especialidad: 'Cardiología' },
  { usuario: 'dra.medina', clave: 'medico123', cmp: 'CMP-14980', nombres: 'Lucía', apellidos: 'Medina Soto', especialidad: 'Traumatología' },
];

export const ADMIN_SEED = {
  usuario: 'admin.recepcion',
  clave: 'admin123',
  codigoEmpleado: 'EMP-0091',
  nombres: 'Carla Mendoza',
};

// Un paciente ya registrado, para poder probar el login sin
// necesidad de pasar primero por el formulario de registro.
export const PACIENTE_DEMO_SEED = {
  usuario: 'jgarcia',
  clave: 'paciente123',
  dni: '47102233',
  nombres: 'Julia',
  apellidos: 'García Rojas',
  fechaNacimiento: '1994-03-12',
  telefono: '987654321',
  correo: 'julia.garcia@mail.com',
  direccion: 'Av. Los Ficus 320, Lima',
};
