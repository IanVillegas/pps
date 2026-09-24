'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/sad-aml-shared/components/Templates/DashboardLayout/DashboardLayout';
import Header from '@/sad-aml-shared/components/Organisms/Header/Header';
import SideBar from '@/sad-aml-shared/components/Organisms/SideBar/SideBar';
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
    <DashboardLayout
      title={step?.title ?? 'Declaración Patrimonial'}
      titleIcon={step && <i className={step.iconClass} />}
      compactTitle={Boolean(step)}
      sidebar={
        <SideBar
          items={items}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(collapsed => !collapsed)}
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
      header={<Header clientName={user.displayName} handleLogout={onLogout} />}
    >
      {children}
    </DashboardLayout>
  );
};

export default AppShell;
