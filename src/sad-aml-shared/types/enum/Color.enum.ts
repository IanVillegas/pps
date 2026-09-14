export enum ColorEnum {
  Primary = 'primary',
  Secondary = 'secondary',
  Green = 'green',
  Gray = 'gray',
  Disabled = 'disabled',
  Dark = 'dark',
  Red = 'red',
  Warning = 'warning',
  Link = 'link',
  Danger = 'danger',
  Secondary200 = 'secondary-200',
  Gray300 = 'gray-300',
  Gray400 = 'gray-400',
  Gray500 = 'gray-500',
  Yellow600 = 'yellow-600',
  // !Agregado para DecPat (2026-09-14): el CTA amarillo de Figma (#FDD058)
  // ya existe en la paleta como $accent-400, pero ningun valor de este enum
  // tenia una clase CSS que lo usara. Ver Button.module.scss.
  Cta = 'cta',
}
