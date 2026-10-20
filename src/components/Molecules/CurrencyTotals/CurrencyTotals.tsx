import { useId } from 'react';
import { formatCurrency } from '@/utils/money';
import styles from './CurrencyTotals.module.scss';

export interface CurrencyFigures {
  /** Suma de saldos totales. */
  balance: number;
  /** Sumatoria de cuotas mensuales. */
  installments: number;
}

export interface CurrencyTotalsData {
  colones: CurrencyFigures;
  dolares: CurrencyFigures;
}

interface CurrencyTotalsProps {
  /** Titulo de la seccion ("Saldo actual de creditos"). */
  heading: string;
  colonesTitle: string;
  dolaresTitle: string;
  /** Sin datos todavia (el backend no ha respondido) se muestra un guion. */
  totals?: CurrencyTotalsData | null;
}

// Mientras no llega la primera respuesta del backend no hay cifra que mostrar.
const NO_FIGURE = '—';

interface CurrencyColumnProps {
  title: string;
  symbol: string;
  figures?: CurrencyFigures;
}

const CurrencyColumn = ({ title, symbol, figures }: CurrencyColumnProps) => (
  <div className={styles.currencyTotals__currency}>
    <span className={styles.currencyTotals__icon} aria-hidden="true">
      {symbol}
    </span>
    <div>
      <h4 className={styles.currencyTotals__currencyTitle}>{title}</h4>
      <dl className={styles.currencyTotals__figures}>
        <div>
          <dt>Suma de saldos totales</dt>
          <dd>
            {figures ? formatCurrency(figures.balance, symbol) : NO_FIGURE}
          </dd>
        </div>
        <div>
          <dt>Sumatoria de cuotas mensuales</dt>
          <dd>
            {figures ? formatCurrency(figures.installments, symbol) : NO_FIGURE}
          </dd>
        </div>
      </dl>
    </div>
  </div>
);

/**
 * Totales por moneda de los pasos de creditos y tarjetas (Figma, nodos
 * 43121:3274 y 43121:2819): una columna en colones y otra en dolares, cada
 * una con su icono rojo, la suma de saldos y la sumatoria de cuotas
 * mensuales. Solo muestra lo que entrega el backend (D-10): no suma ni
 * convierte nada.
 */
const CurrencyTotals = ({
  heading,
  colonesTitle,
  dolaresTitle,
  totals,
}: CurrencyTotalsProps) => {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.currencyTotals__heading}>
        {heading}
      </h3>
      <div className={styles.currencyTotals__columns}>
        <CurrencyColumn
          title={colonesTitle}
          symbol="₡"
          figures={totals?.colones}
        />
        <CurrencyColumn
          title={dolaresTitle}
          symbol="$"
          figures={totals?.dolares}
        />
      </div>
    </section>
  );
};

export default CurrencyTotals;
