// Formatea un valor de cédula según el tipo de identificación costarricense
// Ejemplo: 1-2345-6789, 01-1234-0561, 123456789

export function formatIdentification(value: string): string {
  // Elimina todo lo que no sea número
  const digits = value.replace(/\D/g, '');

  // Cédula física nacional (9 dígitos): 1-2345-6789
  if (digits.length === 9) {
    return `${digits[0]}-${digits.slice(1, 5)}-${digits.slice(5)}`;
  }
  // Cédula jurídica (10 dígitos): 3-101-123456
  if (digits.length === 10) {
    return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4)}`;
  }
  // DIMEX extranjero (cédula de extranjero):
  // 12 dígitos, inicia con 1 o 2 (ejemplo: 123456789012)
  if (digits.length === 12 && (digits[0] === '1' || digits[0] === '2')) {
    // Formato sugerido: 1234-567890-12
    return `${digits.slice(0, 4)}-${digits.slice(4, 10)}-${digits.slice(10)}`;
  }
  // DIMEX nacional (11 dígitos): 00000000000
  if (digits.length === 11) {
    return digits;
  }
  // Si no coincide, retorna el valor original
  return value;
}
