# Sistema de Gestión de Citas y Atención de Pacientes — Clínica Santa Rita

Prototipo funcional en **React + Vite**, implementado a partir del caso de estudio y del
diagrama de clases (`Diagrama_de_Clases_-_Sistema_Gestion_de_Citas.drawio`). No es una demo
de una sola pantalla: es un sistema navegable con registro real de pacientes, login por
rol, solicitud y gestión de citas, atención médica, historial clínico y recetas.

## Roles del sistema

| Rol | Qué puede hacer |
|---|---|
| **Paciente** | Registrarse, iniciar sesión, solicitar citas (especialidad → médico → fecha → horario disponible), ver sus citas y consultar su historial clínico con recetas. |
| **Médico** | Ver su agenda del día (pacientes citados), registrar la atención médica (síntomas, diagnóstico, tratamiento, observaciones) y emitir una receta con uno o varios medicamentos (nombre, dosis, frecuencia, duración). |
| **Personal administrativo** | Ver todas las citas con filtros por fecha, paciente, médico o especialidad; confirmar, reprogramar o cancelar citas; revisar la bitácora de acciones del sistema. |

Cada acción importante (registrar paciente, confirmar/reprogramar/cancelar cita, registrar
atención, emitir receta) queda registrada en `AccionSistema` junto con el usuario
responsable, tal como pide el caso de estudio.

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `jgarcia` | `paciente123` | Paciente (ya registrado) |
| `dr.torres` | `medico123` | Médico · Cardiología |
| `dra.flores` | `medico123` | Médico · Pediatría |
| `admin.recepcion` | `admin123` | Personal administrativo |

También puedes registrar un paciente nuevo desde la pantalla de login ("Regístrate aquí").
Hay un médico por cada una de las 6 especialidades del caso (Medicina General, Pediatría,
Dermatología, Ginecología, Cardiología, Traumatología); revisa `src/data/seed.js` para ver
los usuarios de todos.

Los datos se guardan en el `localStorage` del navegador, así que persisten aunque recargues
la página. El botón **"Reiniciar datos de la demo"** (visible en la pantalla de login) borra
todo y vuelve a sembrar los datos iniciales.

## Cómo se implementó el diagrama de clases

Cada clase del diagrama tiene su archivo en `src/model/`, con sus atributos, métodos y
relaciones (generalización, composición, agregación):

```
src/model/
├── Usuario.js      # Usuario (base) + Paciente, Medico, PersonalAdministrativo (generalización)
├── Especialidad.js # Especialidad · listarMedicos()
├── Agenda.js        # AgendaMedica + HorarioAgenda (composición)
├── Cita.js          # CitaMedica + enum EstadoCita
├── Clinico.js        # HistorialClinico + AtencionMedica (composición)
├── Receta.js         # RecetaMedica + DetalleMedicamento (composición)
└── AccionSistema.js  # Bitácora de auditoría
```

`src/store/ClinicaSistema.js` es la raíz de agregación: orquesta todas las clases (verifica
disponibilidad, reserva/libera horarios, genera la cita en estado "pendiente", asocia la
atención al historial clínico del paciente, etc.), y hace de "backend" simulado del
prototipo (sin necesidad de configurar un servidor o base de datos real).

## Estructura del proyecto

```
citas-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                 # Enrutamiento por rol (login/registro/paciente/médico/admin)
    ├── App.css
    ├── model/                  # Clases del diagrama (ver arriba)
    ├── data/seed.js             # Especialidades, médicos y usuario administrativo iniciales
    ├── store/ClinicaSistema.js  # Lógica de negocio + persistencia en localStorage
    ├── context/ClinicaContext.jsx
    ├── components/              # Navbar, EstadoBadge, Modal
    └── pages/
        ├── LoginPage.jsx
        ├── RegistroPacientePage.jsx
        ├── PacienteDashboard.jsx
        ├── MedicoDashboard.jsx
        └── AdminDashboard.jsx
```

## Cómo abrirlo en StackBlitz

**Opción A — Import por GitHub (recomendado):**
1. Sube esta carpeta (`citas-app/`) a un repositorio de GitHub.
2. Ve a `https://stackblitz.com/github/<usuario>/<repo>` (reemplaza con tu repo).
3. StackBlitz detecta el `package.json` y ejecuta `npm install` + `npm run dev` automáticamente.

**Opción B — Crear el proyecto manualmente en StackBlitz:**
1. Entra a [stackblitz.com](https://stackblitz.com) → "Create new project" → plantilla **Vite + React**.
2. Borra los archivos de ejemplo que trae la plantilla.
3. Copia y pega el contenido de cada archivo de esta carpeta respetando la misma
   estructura de carpetas (`src/model/`, `src/data/`, `src/store/`, `src/context/`,
   `src/components/`, `src/pages/`).
4. StackBlitz recarga solo; no necesitas instalar nada manualmente.

**Opción C — Local:**
```bash
npm install
npm run dev
```

## Notas sobre el alcance del prototipo

- No hay backend real ni base de datos: `ClinicaSistema` simula esa capa en memoria y la
  respalda en `localStorage` para que la demo sea persistente entre recargas.
- Las contraseñas se guardan en texto plano en el navegador solo porque es un prototipo de
  demostración académica; un sistema en producción nunca debería hacer esto (se usaría
  hashing y un backend con autenticación real).
- El horario de atención simulado es de 09:00–13:00 y 15:00–18:00 en bloques de 30 minutos,
  generado dinámicamente por médico y por día en `AgendaMedica`.
