// app/layout.tsx
import { poppins, worksans } from '@/sad-aml-shared/assets/fonts/fonts';
import '@/styles/globals.scss';
// sad-aml-shared usa iconos remixicon (spinner de Button, mostrar/ocultar
// contrasena de InputSecret, cerrar de Modal) pero no carga la fuente por su
// cuenta; sin este import esos iconos no se ven. Cargado aqui una sola vez
// para toda la app.
import 'remixicon/fonts/remixicon.css';
import type { ReactNode } from 'react';

// Metadata DecPat (DEC-001B). Sin openGraph/twitter: esos campos necesitan
// una URL de dominio real, y este proyecto no tiene una todavia (no se
// inventa una). robots en noindex/nofollow: es un sistema interno de
// declaracion patrimonial, no debe indexarse publicamente.
export const metadata = {
  title: {
    default: 'DecPat',
    template: '%s | DecPat',
  },
  description:
    'Sistema de Declaración Patrimonial de Grupo Mutual: acceso, formulario de doce pasos y estados de envío.',
  keywords: ['nextjs', 'decpat', 'declaracion-patrimonial', 'grupo-mutual'],
  authors: [{ name: 'Grupo Mutual' }],
  creator: 'Grupo Mutual',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${worksans.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
