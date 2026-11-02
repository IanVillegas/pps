export const FIELD_MAX_LENGTH = {
  /** Login: usuario */
  username: 60,
  /** Login: contraseña */
  password: 100,
  /** Nombre y apellidos, Ultimo grado academico, Carrera, Oficina */
  personName: 120,
  /** Cedula: formatos con guiones */
  idNumber: 20,
  /** Edad en años cumplidos. */
  age: 3,
  /** Telefono habitación/celular. */
  phone: 20,
  /** Dirección exacta */
  address: 500,
  /** Numero de finca (Bienes inmuebles) */
  fincaNumber: 30,
  /** Ubicacion de un bien inmueble o descripcion de un bien mueble */
  location: 200,
  /** Monto en colones/dolares, escrito solo con digitos (sin separadores) */
  amount: 15,
  /** Forma de adquisicion de un bien inmueble (texto libre) */
  acquisitionForm: 60,
  /** Descripcion de la situacion financiera (paso 3, texto libre largo) */
  situationDetail: 1000,
  /** Tipo de prestamo o de credito (paso 8, texto libre) */
  loanType: 60,
  /** Periodo de una tarjeta de credito (paso 9, texto libre) */
  cardPeriod: 40,
  /** Objetivo de una personeria juridica (paso 10, texto libre) */
  legalEntityPurpose: 200,
  /** Plazo de una personeria juridica (paso 10, solo digitos) */
  legalEntityTerm: 4,
  /** Cargo en una sociedad (paso 10, texto libre) */
  societyRole: 60,
  /** Porcentaje de acciones de una sociedad (paso 10, digitos y punto decimal) */
  sharePercent: 6,
  /** Tipo de poder del apoderado de una sociedad (paso 10, texto libre) */
  powerType: 60,
  /** Detalle de un juicio o embargo (paso 11, texto libre) */
  judicialDetail: 300,
  /** Detalle de los cambios en la situacion patrimonial (paso 3, texto libre largo) */
  patrimonialChangesDetail: 1000,
  /** Detalle de una denuncia del cuestionario confidencial (paso 12, texto libre largo) */
  confidentialDetail: 1000,
  /** Numero de cuenta o de titulo de ahorro (paso 6, texto libre) */
  accountNumber: 30,
} as const;
