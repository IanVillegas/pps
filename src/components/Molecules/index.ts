// Barril de moleculas de DecPat. Mismo criterio que Atoms/index.ts:
// reexporta sad-aml-shared cuando cubre lo que pide Figma, para que las
// pantallas siempre importen desde '@/components/Molecules'.
export { default as Dropdown } from '@/sad-aml-shared/components/Molecules/Dropdown/Dropdown';
export { default as DeclarationStepper } from './DeclarationStepper/DeclarationStepper';
