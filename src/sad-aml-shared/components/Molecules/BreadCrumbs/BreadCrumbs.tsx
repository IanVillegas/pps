import Link from 'next/link';
import styles from './BreadCrumbs.module.scss';
import { EnumBreadCrumbs } from '@/sad-aml-shared/utils/Enums/EnumBreadCrumbs';

export interface IBreadCrumb {
  id: number;
  label: string;
  href: string;
  active: boolean;
}
interface BreadcrumbsProps {
  items: IBreadCrumb[];
  returnFavorite?: boolean;
  urlFavorite?: string;
  goBackUrl?: string;
}
const BreadCrumbs = ({ items, goBackUrl }: BreadcrumbsProps) => {
  const goBackButton = () => {
    if (goBackUrl) {
      return (
        <Link href={goBackUrl} className={styles.backLink}>
          <span className={styles.backLink__icons}>
            <i className="ri-arrow-left-s-line"></i>
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span>Regresar</span>
        </Link>
      );
    }

    if (items.length > 1) {
      return (
        <Link href={items[items.length - 2].href} className={styles.backLink}>
          <span className={styles.backLink__icons}>
            <i className="ri-arrow-left-s-line"></i>
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span>Regresar</span>
        </Link>
      );
    }
    if (items.length === 1) {
      // !Modificado para DecPat (2026-10-27): `next/router` (Pages Router)
      // no existe en el App Router y ademas se llamaba como hook dentro de
      // una condicion; con una sola miga se vuelve a la raiz.
      return (
        <a href="/" className={styles.backLink}>
          <span className={styles.backLink__icons}>
            <i className="ri-arrow-left-s-line"></i>
            <i className="ri-arrow-left-s-line"></i>
          </span>
          <span>Regresar</span>
        </a>
      );
    }
    return (
      <a href={'/'} className={styles.backLink}>
        <span className={styles.backLink__icons}>
          <i className="ri-arrow-left-s-line"></i>
          <i className="ri-arrow-left-s-line"></i>
        </span>
        <span>Regresar</span>
      </a>
    );
  };

  return (
    <nav className={styles.navigator}>
      {goBackButton()}
      <ul className={styles.breadcrumbs}>
        {items?.map(item => (
          <li className={styles.breadcrumbs__item} key={item.id}>
            {item.active ? (
              <Link href={item.href} className={styles.breadcrumbs__link}>
                {EnumBreadCrumbs[item.label] || item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbs__link}>
                {EnumBreadCrumbs[item.label] || item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BreadCrumbs;
