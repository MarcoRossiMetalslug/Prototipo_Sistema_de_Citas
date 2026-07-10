import { useState } from 'react';
import { useClinica } from '../context/ClinicaContext.jsx';

export default function LoginPage({ onIrARegistro }) {
  const { iniciarSesion } = useClinica();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    const resultado = iniciarSesion(usuario.trim(), clave);
    if (!resultado.ok) setError(resultado.error);
  };

  const usarDemo = (u, c) => {
    setUsuario(u);
    setClave(c);
    setError('');
  };

  return (
    <div className="pantalla-centrada">
      <div className="tarjeta-login">
        <div className="tarjeta-login__lado">
          <span className="eyebrow">Acceso al sistema</span>
          <h1>Inicia sesión</h1>
          <p className="texto-suave">
            Ingresa con tu usuario y contraseña. Si eres paciente y aún no tienes cuenta, puedes
            registrarte en un minuto.
          </p>

          <form className="formulario" onSubmit={enviar}>
            <label>
              Usuario
              <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="p. ej. jgarcia" required />
            </label>
            <label>
              Contraseña
              <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
            </label>
            {error && <p className="mensaje-error">{error}</p>}
            <button className="btn btn--principal" type="submit">
              Iniciar sesión
            </button>
          </form>

          <p className="texto-suave" style={{ marginTop: 18 }}>
            ¿Eres paciente nuevo?{' '}
            <button className="enlace" onClick={onIrARegistro}>
              Regístrate aquí
            </button>
          </p>
        </div>

        <div className="tarjeta-login__demo">
          <span className="eyebrow eyebrow--claro">Credenciales de prueba</span>
          <p className="texto-suave texto-suave--claro">
            Usa cualquiera de estas cuentas para explorar los tres roles del sistema.
          </p>
          <div className="demo-lista">
            <button className="demo-cuenta" onClick={() => usarDemo('jgarcia', 'paciente123')}>
              <strong>Paciente</strong>
              <span>jgarcia / paciente123</span>
            </button>
            <button className="demo-cuenta" onClick={() => usarDemo('dr.torres', 'medico123')}>
              <strong>Médico · Cardiología</strong>
              <span>dr.torres / medico123</span>
            </button>
            <button className="demo-cuenta" onClick={() => usarDemo('dra.flores', 'medico123')}>
              <strong>Médico · Pediatría</strong>
              <span>dra.flores / medico123</span>
            </button>
            <button className="demo-cuenta" onClick={() => usarDemo('dr.rios', 'medico123')}>
              <strong>Medicina General</strong>
              <span>dr.rios / medico123</span>
            </button>
            <button className="demo-cuenta" onClick={() => usarDemo('admin.recepcion', 'admin123')}>
              <strong>Personal administrativo</strong>
              <span>admin.recepcion / admin123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
