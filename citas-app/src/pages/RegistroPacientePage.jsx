import { useState } from 'react';
import { useClinica } from '../context/ClinicaContext.jsx';

const VACIO = {
  dni: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  telefono: '',
  correo: '',
  direccion: '',
  usuario: '',
  clave: '',
};

export default function RegistroPacientePage({ onIrALogin }) {
  const { registrarPaciente } = useClinica();
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState('');

  const actualizar = (campo) => (e) => setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    if (datos.dni.length < 8) {
      setError('El DNI debe tener 8 dígitos.');
      return;
    }
    const resultado = registrarPaciente(datos);
    if (!resultado.ok) setError(resultado.error);
  };

  return (
    <div className="pantalla-centrada">
      <div className="tarjeta-registro">
        <span className="eyebrow">Registro de paciente</span>
        <h1>Crea tu cuenta</h1>
        <p className="texto-suave">
          Completa tus datos personales para poder solicitar citas médicas y consultar tu
          historial clínico.
        </p>

        <form className="formulario formulario--grid" onSubmit={enviar}>
          <label>
            DNI
            <input value={datos.dni} onChange={actualizar('dni')} maxLength={8} placeholder="8 dígitos" required />
          </label>
          <label>
            Fecha de nacimiento
            <input type="date" value={datos.fechaNacimiento} onChange={actualizar('fechaNacimiento')} required />
          </label>
          <label>
            Nombres
            <input value={datos.nombres} onChange={actualizar('nombres')} required />
          </label>
          <label>
            Apellidos
            <input value={datos.apellidos} onChange={actualizar('apellidos')} required />
          </label>
          <label>
            Teléfono
            <input value={datos.telefono} onChange={actualizar('telefono')} required />
          </label>
          <label>
            Correo electrónico
            <input type="email" value={datos.correo} onChange={actualizar('correo')} required />
          </label>
          <label className="span-2">
            Dirección
            <input value={datos.direccion} onChange={actualizar('direccion')} required />
          </label>
          <label>
            Usuario
            <input value={datos.usuario} onChange={actualizar('usuario')} required />
          </label>
          <label>
            Contraseña
            <input type="password" value={datos.clave} onChange={actualizar('clave')} required />
          </label>

          {error && (
            <p className="mensaje-error span-2" style={{ marginBottom: 0 }}>
              {error}
            </p>
          )}

          <div className="span-2 formulario__acciones">
            <button type="button" className="btn btn--fantasma" onClick={onIrALogin}>
              Ya tengo cuenta
            </button>
            <button type="submit" className="btn btn--principal">
              Registrarme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
