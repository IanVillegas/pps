// app/layout.tsx
import { poppins, worksans } from '@/sad-aml-shared/assets/fonts/fonts';
import '@/styles/globals.scss';
import 'remixicon/fonts/remixicon.css';
import type { ReactNode } from 'react';

// Metadata en caso de necesitar posicionamiento SEO
export const metadata = {
  title: {
    default: 'DecPat',
    template: '%s | DecPat',
  },
  description: 'Sistema de Declaración Patrimonial de Grupo Mutual.',
  keywords: ['nextjs', 'decpat', 'declaración patrimonial', 'grupo-mutual'],
  authors: [{ name: 'Equipo Grupo Mutual' }],
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
