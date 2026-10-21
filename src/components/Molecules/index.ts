// Barril de moleculas de DecPat. Mismo criterio que Atoms/index.ts:
// reexporta sad-aml-shared cuando cubre lo que pide Figma, para que las
// pantallas siempre importen desde '@/components/Molecules'.
export { default as Dropdown } from '@/sad-aml-shared/components/Molecules/Dropdown/Dropdown';
export { default as DeclarationStepper } from './DeclarationStepper/DeclarationStepper';
export { default as FileUpload } from './FileUpload/FileUpload';
export { default as RadioGroup } from './RadioGroup/RadioGroup';
export { default as CurrencyTotals } from './CurrencyTotals/CurrencyTotals';
export { default as MoneyInput } from './MoneyInput/MoneyInput';
export { default as CurrencySelect } from './CurrencySelect/CurrencySelect';
