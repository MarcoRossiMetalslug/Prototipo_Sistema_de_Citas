import { EstadoCitaLabel } from '../model/Cita.js';

export default function EstadoBadge({ estado }) {
  return <span className={`badge badge--${estado}`}>{EstadoCitaLabel[estado] ?? estado}</span>;
}
