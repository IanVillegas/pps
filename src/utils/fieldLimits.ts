// Limites de caracteres SIMBOLICOS para los campos de texto libre del
// sistema. Ningun contrato de backend define todavia un maximo real por
// campo (D-09/D-17, `preparacion-tecnica-visual.md`); estos valores solo
// evitan que alguien escriba sin ningun limite mientras tanto. Un solo
// lugar para reemplazarlos cuando exista el contrato real, sin tocar los
// componentes que los usan.
export const FIELD_MAX_LENGTH = {
  /** Login: usuario. */
  username: 60,
  /** Login: contraseña (generoso a proposito, no restringe frases largas). */
  password: 100,
  /** Nombre y apellidos, Ultimo grado academico, Carrera, Oficina. */
  personName: 120,
  /** Cedula: formatos con guiones (fisica/juridica/DIMEX) caben holgado. */
  idNumber: 20,
  /** Edad en anos cumplidos. */
  age: 3,
  /** Telefono habitacion/celular. */
  phone: 20,
  /** Direccion exacta (Textarea, texto libre mas largo). */
  address: 500,
  /** Numero de finca (Bienes inmuebles). */
  fincaNumber: 30,
  /** Ubicacion de un bien inmueble o descripcion de un bien mueble. */
  location: 200,
  /** Monto en colones/dolares, escrito solo con digitos (sin separadores). */
  amount: 15,
  /** Forma de adquisicion de un bien inmueble (texto libre, ver Destino). */
  acquisitionForm: 60,
} as const;
