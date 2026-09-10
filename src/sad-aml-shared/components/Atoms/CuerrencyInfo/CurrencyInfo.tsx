'use client';

import { useTranslation } from 'react-i18next';
import styles from '@/sad-aml-shared/components/Atoms/CuerrencyInfo/CurrencyInfo.module.scss';
import { Picture, Title } from '@/sad-aml-shared/components/Atoms';
import newLogo from '@/sad-aml-shared/assets/images/logo-orange-with-black-letters.svg';

interface CurrencyInfoProps {
  buyRate: string;
  sellRate: string;
}

const CurrencyInfo = ({}: CurrencyInfoProps) => {
  const [t] = useTranslation('global');
  return (
    <div className={styles.currencyInfo}>
      <div className={styles.currencyInfo__logo}>
        <Picture
          src={newLogo}
          alt={t('LogoML.image.alt')}
          height={82.19}
          width={160}
        />
      </div>

      <span className={styles.currencyInfo__iconTable}>
        <i className="ri-money-dollar-circle-line"></i>
      </span>
      {/*<div className={styles.currencyInfo__content}>
                <span>Compra ₡{buyRate}</span>
                <span className={styles.currencyInfo__icon}>
                    <i className="ri-money-dollar-circle-line"></i>
                </span>
                <span>Venta ₡{sellRate}</span>
            </div>*/}
      <Title
        text={'Pagos y Consultas'}
        className={styles.currencyInfo__title}
      />
      {/* <BreadCrumbsAndBack
                    showLast={false}
                    last={{
                        href: '/',
                        label:'pagos-y-consultas',
                        id: 'breadCrumb-cuenta',
                        active: false,
                    }}
                /> */}
      <span className={styles.currencyInfo__arrow}>
        <i className="ri-arrow-down-s-line"></i>
      </span>
    </div>
  );
};

export default CurrencyInfo;
