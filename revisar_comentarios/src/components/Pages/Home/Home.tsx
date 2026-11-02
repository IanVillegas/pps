'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonColor } from '@/components/Atoms';
import HelpDialog from '@/components/Organisms/HelpDialog/HelpDialog';
import ErrorIllustration from '@/assets/images/ErrorIllustration';
import styles from './Home.module.scss';

//const isDev = process.env.NODE_ENV !== 'production';

const Home = () => {
  const searchParams = useSearchParams();

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
      </div>
      <div className={styles.home__help}>
        <span
          className={`${styles.home__cardIcon} ${styles['home__cardIcon--badge']}`}
        >
          <i className="ri-customer-service-line" aria-hidden="true" />
        </span>
        <p className={styles.home__helpText}>
          <strong>¿Necesitas ayuda?</strong> Escribe a Talento Humano.
        </p>
        <div className={styles.home__helpAction}>
          <Button
            text="Contactos"
            color={ButtonColor.Secondary}
            size="x-small"
            block
            onClick={() => setHelpOpen(true)}
          />
        </div>
      </div>
      {/**
      {isDev && (
        <button
          type="button"
          className={styles.home__devTrigger}
          onClick={() => setShowErrorDemo(true)}
        >
          Simular error (SOLO desarrollo)
        </button>
      )} 
      */}
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};

export default Home;
