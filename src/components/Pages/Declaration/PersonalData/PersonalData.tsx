'use client';

import { InputText, Textarea } from '@/components/Atoms';
import { Dropdown } from '@/components/Molecules';
import {
  MARITAL_STATUS_OPTIONS,
  AGENCY_OPTIONS,
} from '@/services/CatalogService';
import type { PersonalDataValues } from '@/types/PersonalData.types';
import type { StepErrors, StepValues } from '@/types/Declaration.types';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import styles from './PersonalData.module.scss';

const MARITAL_STATUS = MARITAL_STATUS_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));
const AGENCIES = AGENCY_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));

// Valida los once campos obligatorios del paso. D-09: sin formato/catalogo
// confirmado por backend, asi que solo se exige presencia, no un patron
// (cedula/telefono).
export const validatePersonalData = (stepValues: StepValues): StepErrors => {
  const values = stepValues as PersonalDataValues;
  const required: [keyof PersonalDataValues, string][] = [
    ['fullName', 'El nombre y los apellidos son requeridos'],
    ['idNumber', 'La cédula es requerida'],
    ['age', 'La edad es requerida'],
    ['maritalStatus', 'El estado civil es requerido'],
    ['lastAcademicDegree', 'El último grado académico es requerido'],
    ['career', 'La carrera es requerida'],
    ['homePhone', 'El teléfono de habitación es requerido'],
    ['agency', 'La agencia es requerida'],
    ['cellPhone', 'El teléfono celular es requerido'],
    ['office', 'La oficina es requerida'],
    ['address', 'La dirección es requerida'],
  ];
  const errors: StepErrors = {};
  required.forEach(([field, message]) => {
    if (!values[field]?.trim()) errors[field] = message;
  });
  return errors;
};

/**
 * Paso 1, Datos generales (DEC-007, nodo Figma 43121:6243, composicion
 * inferior). Once campos, todos obligatorios. Solo "Estado civil" y
 * "Agencia" son Select en el diseno real -- "Ultimo grado academico
 * obtenido" y "Oficina para la que labora" son texto libre (ver
 * PersonalData.types.ts, corrige lo que decia `todo.md`).
 */
const PersonalData = ({ values, errors, onChange }: StepProps) => {
  const data = values as PersonalDataValues;
  const set = <K extends keyof PersonalDataValues>(
    field: K,
    value: PersonalDataValues[K]
  ) => onChange({ ...data, [field]: value });

  return (
    <div className={styles.personalData}>
      <InputText
        label="Nombre y apellidos *"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={data.fullName ?? ''}
        errors={errors.fullName}
        onChange={event => set('fullName', event.target.value)}
      />
      <Dropdown
        label="Estado civil *"
        placeholder="Selecciona"
        options={MARITAL_STATUS}
        value={data.maritalStatus}
        errors={errors.maritalStatus}
        onChange={value => set('maritalStatus', value)}
      />
      <InputText
        label="Cédula *"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.idNumber}
        value={data.idNumber ?? ''}
        errors={errors.idNumber}
        onChange={event => set('idNumber', event.target.value)}
      />
      <InputText
        label="Último grado académico obtenido *"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={data.lastAcademicDegree ?? ''}
        errors={errors.lastAcademicDegree}
        onChange={event => set('lastAcademicDegree', event.target.value)}
      />
      <InputText
        label="Edad en años cumplidos *"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.age}
        value={data.age ?? ''}
        errors={errors.age}
        onChange={event => set('age', event.target.value)}
      />
      <InputText
        label="Carrera *"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={data.career ?? ''}
        errors={errors.career}
        onChange={event => set('career', event.target.value)}
      />
      <InputText
        label="Teléfono habitación *"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.phone}
        value={data.homePhone ?? ''}
        errors={errors.homePhone}
        onChange={event => set('homePhone', event.target.value)}
      />
      <Dropdown
        label="Agencia *"
        placeholder="Selecciona"
        options={AGENCIES}
        value={data.agency}
        errors={errors.agency}
        onChange={value => set('agency', value)}
      />
      <InputText
        label="Teléfono celular *"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.phone}
        value={data.cellPhone ?? ''}
        errors={errors.cellPhone}
        onChange={event => set('cellPhone', event.target.value)}
      />
      <InputText
        label="Oficina para la que labora *"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={data.office ?? ''}
        errors={errors.office}
        onChange={event => set('office', event.target.value)}
      />
      <div className={styles.personalData__full}>
        <Textarea
          label="Dirección actual (exacta) *"
          maxLength={FIELD_MAX_LENGTH.address}
          value={data.address ?? ''}
          errors={errors.address}
          onChange={event => set('address', event.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalData;
