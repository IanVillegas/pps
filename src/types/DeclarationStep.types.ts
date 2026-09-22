export interface DeclarationStep {
  /** Numero del paso (1-12); tambien es el segmento de `/mi-declaracion/[paso]`. */
  id: number;
  /** Nombre completo de la seccion, tal como titula la pantalla en Figma. */
  title: string;
  /** Clase de Remix Icon que acompana el titulo de la seccion en Figma. */
  iconClass: string;
}
