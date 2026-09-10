import { useRouter } from 'next/router';
import BreadCrumbs from '../../Molecules/BreadCrumbs/BreadCrumbs';
import type { IBreadCrumb } from '../../Molecules/BreadCrumbs/BreadCrumbs';
import style from './BreadCrumbsAndBack.module.scss';

interface IPropsBreadCrumbs {
  showLast?: boolean;
  last?: { href: string; label: string; id: string | number; active: boolean };
  returnFavorite?: boolean;
  urlFavorite?: string;
  goBackUrl?: string;
}
export const BreadCrumbsAndBack = ({
  showLast = true,
  last,
  returnFavorite = false,
  urlFavorite = '',
  goBackUrl,
}: IPropsBreadCrumbs) => {
  const router = useRouter();

  const generateBreadcrumbs = (): IBreadCrumb[] => {
    const asPathWithoutQuery = router.asPath.split('?')[0];

    const asPathNestedRoutes = asPathWithoutQuery
      .split('/')
      .filter(path => path.length > 0 && path !== 'index.html');

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
      const text = subpath;
      const last = idx !== asPathNestedRoutes.length - 1;
      return { href, label: text, id: Math.random(), active: last };
    });

    if (!showLast) {
      crumbList.pop();
      crumbList[crumbList.length - 1] = {
        ...crumbList[crumbList.length - 1],
        active: true,
      };
      if (last) {
        crumbList.push({ ...last, id: Number(last.id) });
      }
    }
    return [
      {
        href: '/',
        label: router.basePath.replace('/', ''),
        id: Math.random(),
        active: true,
      },
      ...crumbList,
    ];
  };

  const breadcrumbs = generateBreadcrumbs();
  return (
    <div className={style.BreadCrumbsAndBack_container}>
      <BreadCrumbs
        items={breadcrumbs}
        returnFavorite={returnFavorite}
        urlFavorite={urlFavorite}
        goBackUrl={goBackUrl}
      />
    </div>
  );
};
