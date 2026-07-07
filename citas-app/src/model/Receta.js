let idRecetaSeq = 1;
let idDetalleSeq = 1;

export function ajustarSecuenciaReceta(maxId) {
  idRecetaSeq = Math.max(idRecetaSeq, maxId + 1);
}
export function ajustarSecuenciaDetalle(maxId) {
  idDetalleSeq = Math.max(idDetalleSeq, maxId + 1);
}

// 1 RecetaMedica -> 1..* DetalleMedicamento (composición)
export class DetalleMedicamento {
  constructor({ nombreMedicamento, dosis, frecuencia, duracion }) {
    this.idDetalle = idDetalleSeq++;
    this.nombreMedicamento = nombreMedicamento;
    this.dosis = dosis;
    this.frecuencia = frecuencia;
    this.duracion = duracion;
  }

  actualizarIndicacion({ dosis, frecuencia, duracion }) {
    if (dosis) this.dosis = dosis;
    if (frecuencia) this.frecuencia = frecuencia;
    if (duracion) this.duracion = duracion;
  }
}

export class RecetaMedica {
  constructor({ idAtencion, indicaciones }) {
    this.idReceta = idRecetaSeq++;
    this.idAtencion = idAtencion;
    this.fechaEmision = new Date().toISOString();
    this.indicaciones = indicaciones || '';
    this.medicamentos = []; // DetalleMedicamento[]
  }

  agregarMedicamento(datos) {
    const detalle = new DetalleMedicamento(datos);
    this.medicamentos.push(detalle);
    return detalle;
  }

  imprimirReceta() {
    const lineas = this.medicamentos.map(
      (m) => `${m.nombreMedicamento} — ${m.dosis}, ${m.frecuencia}, por ${m.duracion}`
    );
    return lineas.join('\n');
  }
}
