import { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react';
import { ClinicaSistema } from '../store/ClinicaSistema.js';

const ClinicaContext = createContext(null);

export function ClinicaProvider({ children }) {
  const sistemaRef = useRef(null);
  if (!sistemaRef.current) sistemaRef.current = new ClinicaSistema();
  const sistema = sistemaRef.current;

  // "version" fuerza un re-render cada vez que mutamos el estado
  // interno del sistema (que vive en clases mutables, no en useState).
  const [version, setVersion] = useState(0);
  const [actor, setActor] = useState(null);

  const sincronizar = useCallback(() => setVersion((v) => v + 1), []);

  const iniciarSesion = useCallback(
    (usuario, clave) => {
      const resultado = sistema.iniciarSesion(usuario, clave);
      if (resultado.ok) setActor(resultado.actor);
      sincronizar();
      return resultado;
    },
    [sistema, sincronizar]
  );

  const registrarPaciente = useCallback(
    (datos) => {
      const resultado = sistema.registrarPaciente(datos);
      if (resultado.ok) setActor(resultado.actor);
      sincronizar();
      return resultado;
    },
    [sistema, sincronizar]
  );

  const cerrarSesion = useCallback(() => {
    sistema.cerrarSesion(actor);
    setActor(null);
    sincronizar();
  }, [sistema, actor, sincronizar]);

  const reiniciarDemo = useCallback(() => {
    sistema.reiniciar();
    setActor(null);
    sincronizar();
  }, [sistema, sincronizar]);

  const value = useMemo(
    () => ({ sistema, version, actor, iniciarSesion, registrarPaciente, cerrarSesion, sincronizar, reiniciarDemo }),
    [sistema, version, actor, iniciarSesion, registrarPaciente, cerrarSesion, sincronizar, reiniciarDemo]
  );

  return <ClinicaContext.Provider value={value}>{children}</ClinicaContext.Provider>;
}

export function useClinica() {
  const ctx = useContext(ClinicaContext);
  if (!ctx) throw new Error('useClinica debe usarse dentro de <ClinicaProvider>');
  return ctx;
}
