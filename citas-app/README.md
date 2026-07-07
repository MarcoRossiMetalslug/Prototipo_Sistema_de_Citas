# Sistema de Gestión de Citas Médicas — Implementación en React

**Actividad 2 — Relación UML seleccionada: Generalización (Herencia)**

## ¿Qué relación se implementó y por qué?

En el diagrama de clases, `Paciente`, `Medico` y `PersonalAdministrativo` heredan de
`Usuario` (flecha de generalización, punta triangular vacía). Los tres actores del
sistema comparten:

- Atributos: `idUsuario`, `usuario`, `clave`, `rol`
- Comportamiento: `iniciarSesion()`, `cerrarSesion()`, `registrarAccion()`

Y cada uno añade su propio comportamiento especializado:

| Subclase | Atributos propios | Métodos propios |
|---|---|---|
| `Paciente` | dni, nombres, apellidos, fechaNacimiento, teléfono, correo, dirección | `registrarse()`, `solicitarCita()`, `consultarHistorial()` |
| `Medico` | cmp, nombres, apellidos, especialidad | `verPacientesCitados()`, `registrarAtencion()`, `emitirReceta()` |
| `PersonalAdministrativo` | codigoEmpleado, nombres | `confirmarCita()`, `reprogramarCita()`, `cancelarCita()` |

Esto se implementó literalmente con clases de JavaScript ES6 usando `extends` y
`super()` en `src/model/Usuario.js`, y se demuestra en pantalla con una app React
donde puedes cambiar de perfil, iniciar sesión y ejecutar los métodos heredados
y propios de cada subclase, viendo en vivo la bitácora de acciones (que corresponde
a la clase `AccionSistema` del diagrama).

## Estructura del proyecto

```
citas-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx          # UI que instancia y ejecuta las clases
    ├── App.css
    └── model/
        └── Usuario.js   # Usuario (base) + Paciente, Medico, PersonalAdministrativo
```

## Cómo abrirlo en StackBlitz

**Opción A — Import por GitHub (recomendado si subes el código a un repo):**
1. Sube esta carpeta a un repositorio de GitHub.
2. Ve a `https://stackblitz.com/github/<usuario>/<repo>` (reemplaza con tu repo).
3. StackBlitz detecta el `package.json` y ejecuta `npm install` + `npm run dev` automáticamente.

**Opción B — Crear el proyecto manualmente en StackBlitz:**
1. Entra a [stackblitz.com](https://stackblitz.com) → "Create new project" → plantilla **Vite + React**.
2. Borra los archivos de ejemplo que trae la plantilla.
3. Copia y pega el contenido de cada archivo de esta carpeta respetando la misma
   ruta (`src/model/Usuario.js`, `src/App.jsx`, `src/App.css`, `src/main.jsx`, `index.html`).
4. StackBlitz recarga solo; no necesitas instalar nada manualmente.

**Opción C — Local:**
```bash
npm install
npm run dev
```

## Cómo usar la demo

1. Elige un perfil (Paciente, Médico o Personal Administrativo) en el diagrama de
   herencia superior.
2. Pulsa `iniciarSesion()`.
3. Ejecuta cualquiera de los métodos propios de esa subclase — verás cómo cada
   una llama internamente a `registrarAccion()`, heredado de `Usuario`, y cómo
   el panel de bitácora (a la derecha) registra la acción con marca de tiempo.
4. Cambia de perfil para comparar el comportamiento polimórfico de
   `obtenerAccionesDisponibles()`.
