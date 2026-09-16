// Barril de atomos de DecPat. Reexporta sad-aml-shared cuando cubre lo que
// pide Figma (ver AGENTS.md); asi las pantallas siempre importan desde
// '@/components/Atoms' sin necesitar saber si el atomo es propio o de
// shared. Un atomo local nuevo solo se agrega aqui cuando shared no tiene
// equivalente (ver tasks/preparacion-tecnica-visual.md, seccion 3).
export { default as Button } from '@/sad-aml-shared/components/Atoms/Button/Button';
export { ColorEnum as ButtonColor } from '@/sad-aml-shared/types/enum/Color.enum';
export { default as InputText } from '@/sad-aml-shared/components/Atoms/InputText/InputText';
export { default as Checkbox } from '@/sad-aml-shared/components/Atoms/Checkbox/Checkbox';
