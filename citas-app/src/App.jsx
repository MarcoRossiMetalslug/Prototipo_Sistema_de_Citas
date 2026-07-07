import { useMemo, useState } from 'react'
import { Paciente, Medico, PersonalAdministrativo } from './model/Usuario.js'

const PERFILES = [
  {
    clase: 'Paciente',
    etiqueta: 'Paciente',
    iniciales: 'PC',
    resumen: 'Hereda de Usuario · agrega datos personales y solicitud de citas.',
    campos: {
      usuario: 'jgarcia',
      clave: '••••••',
      dni: '47102233',
      nombres: 'Julia',
      apellidos: 'García Rojas',
      fechaNacimiento: '1994-03-12',
      telefono: '987654321',
      correo: 'julia.garcia@mail.com',
      direccion: 'Av. Los Ficus 320, Lima',
    },
  },
  {
    clase: 'Medico',
    etiqueta: 'Médico',
    iniciales: 'MD',
    resumen: 'Hereda de Usuario · agrega colegiatura, especialidad y atenciones.',
    campos: {
      usuario: 'dr.torres',
      clave: '••••••',
      cmp: 'CMP-55210',
      nombres: 'Ricardo',
      apellidos: 'Torres Vega',
      especialidad: 'Cardiología',
    },
  },
  {
    clase: 'PersonalAdministrativo',
    etiqueta: 'Personal Administrativo',
    iniciales: 'PA',
    resumen: 'Hereda de Usuario · agrega gestión de citas (confirmar/reprogramar/cancelar).',
    campos: {
      usuario: 'admin.recepcion',
      clave: '••••••',
      codigoEmpleado: 'EMP-0091',
      nombres: 'Carla Mendoza',
    },
  },
]

function crearInstancia(clase, campos) {
  if (clase === 'Paciente') return new Paciente(campos)
  if (clase === 'Medico') return new Medico(campos)
  return new PersonalAdministrativo(campos)
}

export default function App() {
  const [perfilIdx, setPerfilIdx] = useState(0)
  const [instancias, setInstancias] = useState(() =>
    PERFILES.map((p) => crearInstancia(p.clase, p.campos))
  )
  const [bitacoraGlobal, setBitacoraGlobal] = useState([])
  const [citaDemo, setCitaDemo] = useState(null)

  const perfil = PERFILES[perfilIdx]
  const instancia = instancias[perfilIdx]

  const registrar = (accion) => {
    setBitacoraGlobal((prev) => [
      { ...accion, actor: perfil.etiqueta, clase: perfil.clase, id: prev.length + 1 },
      ...prev,
    ].slice(0, 30))
  }

  // Las instancias son clases mutables (Usuario/Paciente/Medico/...), así
  // que tras invocar un método forzamos un nuevo array (misma referencia
  // de objetos, nueva referencia de arreglo) para que React vuelva a
  // renderizar con los datos actualizados de la instancia.
  const sincronizar = () => setInstancias((prev) => [...prev])

  const ejecutarAccion = (nombreAccion) => {
    switch (nombreAccion) {
      case 'registrarse()': {
        const r = instancia.registrarse()
        registrar(r)
        break
      }
      case 'solicitarCita()': {
        const cita = instancia.solicitarCita('Cardiología', '2026-07-14', '10:30')
        setCitaDemo(cita)
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'consultarHistorial()': {
        instancia.consultarHistorial()
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'verPacientesCitados()': {
        instancia.verPacientesCitados()
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'registrarAtencion()': {
        instancia.registrarAtencion(citaDemo || { idCita: 1 }, 'Arritmia leve', 'Control en 30 días')
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'emitirReceta()': {
        instancia.emitirReceta({ idAtencion: 1 }, ['Losartán 50mg', 'Aspirina 100mg'])
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'confirmarCita()': {
        instancia.confirmarCita(citaDemo || { idCita: 1, estado: 'PENDIENTE' })
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'reprogramarCita()': {
        instancia.reprogramarCita(citaDemo || { idCita: 1 }, '2026-07-20', '09:00')
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      case 'cancelarCita()': {
        instancia.cancelarCita(citaDemo || { idCita: 1 })
        registrar(instancia.bitacora[instancia.bitacora.length - 1])
        break
      }
      default:
        break
    }
    sincronizar()
  }

  const iniciarSesion = () => {
    const r = instancia.iniciarSesion()
    registrar(r)
    sincronizar()
  }

  const cerrarSesion = () => {
    const r = instancia.cerrarSesion()
    registrar(r)
    sincronizar()
  }

  const accionesDisponibles = useMemo(
    () => instancia.obtenerAccionesDisponibles(),
    [instancia, bitacoraGlobal]
  )

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__tag">Actividad 2 · Implementación en código</div>
        <h1>
          Sistema de Gestión de Citas <span className="dash">—</span> Generalización
        </h1>
        <p className="masthead__lede">
          Relación UML implementada: <strong>Generalización (herencia)</strong>. La clase{' '}
          <code>Usuario</code> concentra la autenticación y la bitácora de acciones;{' '}
          <code>Paciente</code>, <code>Medico</code> y <code>PersonalAdministrativo</code> heredan
          de ella y sobrescriben <code>obtenerAccionesDisponibles()</code> con su propio
          comportamiento, tal como se modeló en el diagrama de clases del caso de estudio.
        </p>
      </header>

      <section className="hierarchy" aria-label="Diagrama de herencia">
        <div className="hierarchy__node hierarchy__node--base">
          <span className="hierarchy__stereotype">clase base</span>
          Usuario
        </div>
        <div className="hierarchy__lines" aria-hidden="true">
          <svg viewBox="0 0 600 60" preserveAspectRatio="none">
            <path d="M300 0 V20 M300 20 H80 M300 20 H520 M80 20 V50 M300 20 V50 M520 20 V50" />
          </svg>
        </div>
        <div className="hierarchy__children">
          {PERFILES.map((p, i) => (
            <button
              key={p.clase}
              className={
                'hierarchy__node hierarchy__node--child' +
                (i === perfilIdx ? ' is-active' : '')
              }
              onClick={() => setPerfilIdx(i)}
            >
              <span className="hierarchy__stereotype">extends Usuario</span>
              {p.etiqueta}
            </button>
          ))}
        </div>
      </section>

      <main className="workspace">
        <section className="ficha" aria-label="Ficha del usuario seleccionado">
          <div className="ficha__tab">{perfil.iniciales}</div>
          <h2>{perfil.etiqueta}</h2>
          <p className="ficha__resumen">{perfil.resumen}</p>

          <dl className="ficha__datos">
            {Object.entries(perfil.campos).map(([clave, valor]) => (
              <div key={clave} className="ficha__dato">
                <dt>{clave}</dt>
                <dd>{String(valor)}</dd>
              </div>
            ))}
          </dl>

          <div className="ficha__sesion">
            <span className={'estado-dot' + (instancia.sesionActiva ? ' is-on' : '')} />
            {instancia.sesionActiva ? 'Sesión activa' : 'Sin sesión'}
            <div className="ficha__botones">
              <button onClick={iniciarSesion} disabled={instancia.sesionActiva}>
                iniciarSesion()
              </button>
              <button onClick={cerrarSesion} disabled={!instancia.sesionActiva} className="secundario">
                cerrarSesion()
              </button>
            </div>
          </div>

          <h3 className="ficha__subtitulo">Métodos propios (polimorfismo)</h3>
          <div className="acciones">
            {accionesDisponibles.map((accion) => (
              <button
                key={accion}
                className="accion-btn"
                disabled={!instancia.sesionActiva}
                onClick={() => ejecutarAccion(accion)}
                title={!instancia.sesionActiva ? 'Inicia sesión primero' : ''}
              >
                {accion}
              </button>
            ))}
          </div>
        </section>

        <section className="consola" aria-label="Bitácora de acciones (AccionSistema)">
          <div className="consola__header">
            <span className="consola__dot" />
            <span className="consola__dot" />
            <span className="consola__dot" />
            <span className="consola__titulo">bitacora_acciones.log</span>
          </div>
          <div className="consola__cuerpo">
            {bitacoraGlobal.length === 0 && (
              <p className="consola__vacio">
                Aún no hay acciones. Selecciona un perfil, inicia sesión y ejecuta un método para
                ver cómo cada subclase registra su propio comportamiento heredado de Usuario.
              </p>
            )}
            {bitacoraGlobal.map((entrada) => (
              <div key={entrada.id} className="consola__linea">
                <span className="consola__hora">
                  {new Date(entrada.fechaHora).toLocaleTimeString('es-PE', { hour12: false })}
                </span>
                <span className={'consola__clase consola__clase--' + entrada.clase}>
                  {entrada.clase}
                </span>
                <span className="consola__texto">{entrada.descripcion}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="justificacion">
        <h3>Sustento con el caso de estudio</h3>
        <p>
          En el diagrama de clases, <code>Paciente</code>, <code>Medico</code> y{' '}
          <code>PersonalAdministrativo</code> apuntan con una flecha de generalización (punta
          triangular vacía) hacia <code>Usuario</code>, porque los tres actores del sistema
          comparten credenciales de acceso (<code>idUsuario</code>, <code>usuario</code>,{' '}
          <code>clave</code>, <code>rol</code>) y las operaciones <code>iniciarSesion()</code>,{' '}
          <code>cerrarSesion()</code> y <code>registrarAccion()</code>. Cada subclase añade
          exclusivamente lo que le corresponde por rol: el paciente solicita citas y revisa su
          historial; el médico atiende y emite recetas; el personal administrativo confirma,
          reprograma y cancela citas. Esta implementación reproduce esa jerarquía con clases de
          JavaScript ES6 (<code>extends</code> / <code>super()</code>), y el método{' '}
          <code>obtenerAccionesDisponibles()</code> se sobrescribe en cada subclase para demostrar
          el polimorfismo que la generalización habilita.
        </p>
      </footer>
    </div>
  )
}
