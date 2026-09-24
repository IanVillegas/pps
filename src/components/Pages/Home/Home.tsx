'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonColor } from '@/components/Atoms';
import HelpDialog from '@/components/Organisms/HelpDialog/HelpDialog';
import ErrorIllustration from '@/assets/images/ErrorIllustration';
import styles from './Home.module.scss';

// NODE_ENV lo define Next.js solo (no hace falta NEXT_PUBLIC_ENVIRONMENT,
// que en esta copia local ni siquiera esta configurado en .env.local):
// 'development' en npm run dev/dev-preview, 'production' en build/start.
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Inicio (DEC-005B, nodo Figma 43121:6798). AppShell/DashboardLayout ya
 * ponen el header/sidebar y el h1 "Declaracion Patrimonial"; este
 * componente es solo el panel blanco de bienvenida con las dos tarjetas.
 */
const Home = () => {
  const searchParams = useSearchParams();
  // El contenido de esta pantalla es texto estatico de Figma, sin fetch
  // real (D-14 sigue pendiente de contrato/validacion de negocio) — no hay
  // nada que de verdad pueda fallar todavia. Para poder mostrar y probar
  // el "estado de error recuperable" que pide la aceptacion de DEC-005B
  // (nodo 43121:455) sin inventar un servicio mock solo para tener algo
  // que rechazar, hay dos formas de activarlo, las dos solo para demo/QA:
  // el parametro /inicio?demo=error (util para pegar un link ya armado,
  // pero pierde la sesion si se escribe directo en la barra de direcciones
  // porque hace una recarga dura) y el boton de mas abajo, que lo activa
  // sin perder la sesion (solo visible con isDev). "Entendido" lo cierra y
  // muestra el contenido normal.
  const [showErrorDemo, setShowErrorDemo] = useState(
    () => searchParams.get('demo') === 'error'
  );
  const [helpOpen, setHelpOpen] = useState(false);

  if (showErrorDemo) {
    return (
      <div className={styles.home}>
        <div className={styles.home__error}>
          <ErrorIllustration className={styles.home__errorIllustration} />
          <p className={styles.home__errorMessage}>
            Ha ocurrido un error.
            <br />
            Por favor inténtelo más tarde.
          </p>
          <Button
            text="Entendido"
            color={ButtonColor.Cta}
            size="medium"
            onClick={() => setShowErrorDemo(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <h2 className={styles.home__title}>Bienvenido a DecPat</h2>
      <div className={styles.home__cards}>
        <div className={styles.home__card}>
          <div className={styles.home__cardHeader}>
            <span className={styles.home__cardIcon}>
              <i className="ri-information-fill" aria-hidden="true" />
            </span>
            <p>¿Qué es?</p>
          </div>
          <p
            className={`${styles.home__cardText} ${styles['home__cardText--justify']}`}
          >
            Recuerde que la Declaración Patrimonial es una{' '}
            <strong>declaración bajo juramento</strong>, por lo que cada persona
            es responsable de la veracidad, integridad y actualización de la
            información declarada, asumiendo un compromiso ético y legal con la
            transparencia.
          </p>
        </div>
        <div className={styles.home__card}>
          <div className={styles.home__cardHeader}>
            <span
              className={`${styles.home__cardIcon} ${styles['home__cardIcon--badge']}`}
            >
              <i className="ri-customer-service-line" aria-hidden="true" />
            </span>
            <p>¿Necesitas ayuda?</p>
          </div>
          <p className={styles.home__cardText}>
            Escribí a Talento Humano o consultá la normativa de declaración
            patrimonial.
          </p>
          <div className={styles.home__cardAction}>
            <Button
              text="Contactos"
              color={ButtonColor.Cta}
              size="x-small"
              onClick={() => setHelpOpen(true)}
            />
          </div>
        </div>
      </div>
      {isDev && (
        <button
          type="button"
          className={styles.home__devTrigger}
          onClick={() => setShowErrorDemo(true)}
        >
          Simular error (solo desarrollo)
        </button>
      )}
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};

export default Home;
