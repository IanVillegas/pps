'use client';

import { useId } from 'react';
import { InputText, Switch } from '@/components/Atoms';
import { MoneyInput } from '@/components/Molecules';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type { StepErrors, StepValues } from '@/types/Declaration.types';
import type { JudicialValues } from '@/types/JudicialData.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { amountToCents } from '@/utils/money';
import styles from './JudicialData.module.scss';

/**
 * Valida el paso 11. Las cuatro preguntas son interruptores que siempre
 * tienen respuesta («No» por omision), asi que nada se exige mientras esten
 * apagados. Solo los dos campos de la pension llevan asterisco en Figma
 * (nodo 43121:2088) y por eso son obligatorios unicamente cuando la pension
 * esta en «Sí»; el detalle de juicios penales, civiles y embargos no lleva
 * asterisco y es opcional.
 */
export const validateJudicialData = (stepValues: StepValues): StepErrors => {
  const values = stepValues as JudicialValues;
  const errors: StepErrors = {};
  if (!values.alimony) return errors;
  if (!values.alimonyTo?.trim()) {
    errors.alimonyTo = 'Indique a quién paga la pensión alimenticia';
  }
  // Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
  if (amountToCents(values.alimonyAmount ?? '') === null) {
    errors.alimonyAmount = 'El monto que cancela por mes es requerido';
  }
  return errors;
};

type QuestionFlag = 'penal' | 'civil' | 'embargoes';
type DetailField = 'penalDetail' | 'civilDetail' | 'embargoesDetail';

// Mismo orden y texto que Figma.
const QUESTIONS: {
  flag: QuestionFlag;
  detail: DetailField;
  text: string;
  detailLabel: string;
}[] = [
  {
    flag: 'penal',
    detail: 'penalDetail',
    text: '¿Ha estado implicado en juicios por la vía penal?',
    detailLabel: 'Detalle de los juicios por la vía penal',
  },
  {
    flag: 'civil',
    detail: 'civilDetail',
    text: '¿Ha estado implicado en juicios por la vía civil?',
    detailLabel: 'Detalle de los juicios por la vía civil',
  },
  {
    flag: 'embargoes',
    detail: 'embargoesDetail',
    text: '¿Posee usted embargos?',
    detailLabel: 'Detalle de los embargos',
  },
];

/**
 * Paso 11, Datos judiciales (DEC-017, nodos Figma 43121:1791 y 43121:2088).
 * Cuatro preguntas Si/No; al responder «Sí» aparecen sus campos (un detalle
 * opcional en juicios y embargos; «¿A quién?» y el monto mensual,
 * obligatorios, en la pension). Al volver a «No» esos campos se descartan del
 * borrador, de modo que no quedan datos que contradigan la respuesta ni
 * errores de validacion de campos que ya no se ven.
 */
const JudicialData = ({ values, errors, onChange }: StepProps) => {
  const idPrefix = useId();
  const judicial = values as JudicialValues;

  const setFlag = (
    flag: QuestionFlag | 'alimony',
    fields: (keyof JudicialValues)[],
    on: boolean
  ) => {
    const next: Record<string, unknown> = { ...values, [flag]: on };
    // Apagar la pregunta retira sus campos del borrador.
    if (!on) fields.forEach(field => delete next[field]);
    onChange(next);
  };

  const setField = (field: keyof JudicialValues, value: string) =>
    onChange({ ...values, [field]: value });

  return (
    <div className={styles.judicial}>
      {QUESTIONS.map(question => {
        const questionId = `${idPrefix}-${question.flag}`;
        const on = Boolean(judicial[question.flag]);
        return (
          <section key={question.flag} className={styles.judicial__row}>
            <div className={styles.judicial__header}>
              <p id={questionId} className={styles.judicial__question}>
                {question.text}
              </p>
              <Switch
                checked={on}
                aria-labelledby={questionId}
                onChange={value =>
                  setFlag(question.flag, [question.detail], value)
                }
              />
            </div>
            {on && (
              <div className={styles.judicial__detail}>
                <InputText
                  label={question.detailLabel}
                  placeholder="Escribe aquí"
                  maxLength={FIELD_MAX_LENGTH.judicialDetail}
                  value={judicial[question.detail] ?? ''}
                  onChange={event =>
                    setField(question.detail, event.target.value)
                  }
                />
              </div>
            )}
          </section>
        );
      })}
      <section className={styles.judicial__row}>
        <div className={styles.judicial__header}>
          <p id={`${idPrefix}-alimony`} className={styles.judicial__question}>
            ¿Paga pensión alimenticia?
          </p>
          <Switch
            checked={Boolean(judicial.alimony)}
            aria-labelledby={`${idPrefix}-alimony`}
            onChange={value =>
              setFlag('alimony', ['alimonyTo', 'alimonyAmount'], value)
            }
          />
        </div>
        {judicial.alimony && (
          <div className={styles.judicial__alimony}>
            <InputText
              label="¿A quién? *"
              placeholder="Escribe aquí"
              maxLength={FIELD_MAX_LENGTH.personName}
              value={judicial.alimonyTo ?? ''}
              errors={errors.alimonyTo}
              onChange={event => setField('alimonyTo', event.target.value)}
            />
            {/* Figma no dice la moneda de la pension (D-23): sin icono. */}
            <MoneyInput
              label="Monto que cancela por mes *"
              currency={null}
              value={judicial.alimonyAmount ?? ''}
              errors={errors.alimonyAmount}
              onChange={value => setField('alimonyAmount', value)}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default JudicialData;
