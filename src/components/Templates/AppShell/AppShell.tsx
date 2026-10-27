'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/sad-aml-shared/components/Templates/DashboardLayout/DashboardLayout';
import BreadCrumbs from '@/sad-aml-shared/components/Molecules/BreadCrumbs/BreadCrumbs';
import Header from '@/sad-aml-shared/components/Organisms/Header/Header';
import SideBar from '@/sad-aml-shared/components/Organisms/SideBar/SideBar';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import LogoHeader from '@/assets/images/LogoHeader';
import LogoSymbol from '@/assets/images/LogoSymbol';
import type { SessionUser } from '@/types/Session.types';
import { DECLARATION_STEPS } from '@/utils/declarationSteps';
import styles from './AppShell.module.scss';

interface AppShellProps {
  user: SessionUser;
  onLogout: () => void;
  children: ReactNode;
}

// Mismo breakpoint que angosta el sidebar en SideBar.module.scss /
// DashboardLayout.module.scss (`max-width: 1100px`); si se cambia uno hay
// que cambiar los tres. Colapsa a franja de iconos por defecto en tablet
// (pensado para dejar mas ancho a las tablas grandes de los pasos del
// wizard); el boton en el propio SideBar deja expandir/colapsar a mano en
// cualquier ancho, y solo se re-sincroniza con el breakpoint al cruzarlo
// (no pelea con la eleccion manual del usuario dentro del mismo rango).
const TABLET_BREAKPOINT = '(max-width: 1100px)';

// Migas de la declaracion: «Inicio» enlaza y «Mi declaración» es la pantalla
// actual. «Regresar» lleva a la miga anterior (Inicio).
const DECLARATION_BREADCRUMBS = [
  { id: 1, label: 'Inicio', href: '/inicio', active: true },
  { id: 2, label: 'Mi declaración', href: '/mi-declaracion/1', active: false },
];

const AppShell = ({ user, onLogout, children }: AppShellProps) => {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(TABLET_BREAKPOINT);
    setSidebarCollapsed(query.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      setSidebarCollapsed(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);
  const inDeclaration = pathname.startsWith('/mi-declaracion');
  // En un paso del wizard, Figma titula la pantalla con el nombre de la
  // seccion y su icono en lugar del titulo general del sistema.
  const stepId = Number(pathname.match(/^\/mi-declaracion\/(\d+)$/)?.[1]);
  const step = DECLARATION_STEPS.find(item => item.id === stepId);
  const items = [
    {
      id: 'inicio',
      label: 'Inicio',
      href: '/inicio',
      icon: <i className="ri-home-line" />,
      active: pathname === '/inicio',
    },
    {
      id: 'declaracion',
      label: 'Mi declaración',
      href: '/mi-declaracion/1',
      icon: <i className="ri-draft-line" />,
      active: inDeclaration,
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <i className="ri-line-chart-line" />,
    },
    {
      id: 'declaraciones',
      label: 'Declaraciones',
      icon: <i className="ri-file-text-line" />,
    },
    {
      id: 'mantenimientos',
      label: 'Mantenimientos',
      icon: <i className="ri-settings-3-line" />,
    },
  ];

  return (
    <NotificationProvider>
      <DashboardLayout
        title={step?.title ?? 'Declaración Patrimonial'}
        titleIcon={step && <i className={step.iconClass} />}
        compactTitle={Boolean(step)}
        sidebar={
          <SideBar
            items={items}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() =>
              setSidebarCollapsed(collapsed => !collapsed)
            }
            logo={
              <Link href="/inicio" aria-label="Grupo Mutual, inicio">
                <LogoHeader className={styles.logo} />
              </Link>
            }
            collapsedLogo={
              <Link href="/inicio" aria-label="Grupo Mutual, inicio">
                <LogoSymbol className={styles.logoSymbol} />
              </Link>
            }
          />
        }
        header={
          <Header clientName={user.displayName} handleLogout={onLogout}>
            {/* Figma (nodo 43121:6538): «Regresar» y «Inicio / Mi declaración»
                a la izquierda del encabezado, solo dentro de la declaración. */}
            {inDeclaration && <BreadCrumbs items={DECLARATION_BREADCRUMBS} />}
          </Header>
        }
      >
        {children}
      </DashboardLayout>
    </NotificationProvider>
  );
};

export default AppShell;
