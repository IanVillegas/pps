// Valida si el string es un nombre de icono (remixicon, fontawesome, etc)
export function isIconName(mediaElement: string): boolean {
  return (
    typeof mediaElement === 'string' &&
    (mediaElement.startsWith('ri-') || mediaElement.startsWith('fa-'))
  );
}
