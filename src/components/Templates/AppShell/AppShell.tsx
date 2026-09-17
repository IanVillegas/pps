'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/sad-aml-shared/components/Templates/DashboardLayout/DashboardLayout';
import Header from '@/sad-aml-shared/components/Organisms/Header/Header';
import SideBar from '@/sad-aml-shared/components/Organisms/SideBar/SideBar';
import LogoHeader from '@/assets/images/LogoHeader';
import type { SessionUser } from '@/types/Session.types';
import styles from './AppShell.module.scss';

interface AppShellProps {
  user: SessionUser;
  onLogout: () => void;
  children: ReactNode;
}

const AppShell = ({ user, onLogout, children }: AppShellProps) => {
  const pathname = usePathname();
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
      icon: <i className="ri-draft-line" />,
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
      title="Declaración Patrimonial"
      sidebar={
        <SideBar
          items={items}
          logo={
            <Link href="/inicio" aria-label="Grupo Mutual, inicio">
              <LogoHeader className={styles.logo} />
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
