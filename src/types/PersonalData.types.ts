// Paso 1 de la declaracion (nodo Figma 43121:6243, composicion inferior:
// 43121:6765-6786). Los once campos son obligatorios (el usuario confirmo
// 2026-09-22 que a `address` le faltaba el asterisco en Figma). D-03
// resuelto: Figma solo marca 2 de los 11 campos como Dropdown-NEW
// (maritalStatus, agency); "Ultimo grado academico obtenido" y "Oficina
// para la que labora" son texto libre (Field-NEW), no select -- corrige lo
// que decia `todo.md` antes de leer el diseno real.
export interface PersonalDataValues {
  fullName?: string;
  idNumber?: string;
  age?: string;
  maritalStatus?: string;
  lastAcademicDegree?: string;
  career?: string;
  homePhone?: string;
  agency?: string;
  cellPhone?: string;
  office?: string;
  address?: string;
}
