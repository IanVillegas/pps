// app/layout.tsx
import { poppins, worksans } from '@/sad-aml-shared/assets/fonts/fonts';
import '@/styles/globals.scss';
// sad-aml-shared usa iconos remixicon (spinner de Button, mostrar/ocultar
// contrasena de InputSecret, cerrar de Modal) pero no carga la fuente por su
// cuenta; sin este import esos iconos no se ven. Cargado aqui una sola vez
// para toda la app.
import 'remixicon/fonts/remixicon.css';
import type { ReactNode } from 'react';

// Metadata en caso de necesitar posicionamiento SEO
export const metadata = {
  title: {
    default: 'SAD-AML Seguridad',
    template: '%s | SAD-AML Seguridad',
  },
  description:
    'Microfrontend para la gestión de seguridad en la plataforma SAD-AML de Grupo Mutual.',
  keywords: ['nextjs', 'sad-aml', 'microfrontend', 'seguridad', 'grupo mutual'],
  authors: [{ name: 'Equipo Grupo Mutual' }],
  creator: 'Grupo Mutual',
  robots: 'index, follow',
  openGraph: {
    title: 'SAD-AML Seguridad',
    description: 'Microfrontend para seguridad en la plataforma SAD-AML.',
    url: 'https://sad-aml-security.grupomutual.fi.cr',
    siteName: 'SAD-AML Seguridad',
    images: [
      {
        url: 'https://sad-aml-security.grupomutual.fi.cr/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAD-AML Seguridad',
    description: 'Microfrontend de seguridad para Grupo Mutual.',
    images: ['https://sad-aml-security.grupomutual.fi.cr/twitter-image.png'],
    creator: '@grupomutualcr',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${worksans.variable} ${poppins.variable}`}>
      <body>
        <header>
          {/* Puedes reemplazar por un componente Header global */}
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a237e' }}>
            SAD-AML Seguridad
          </h1>
        </header>
        <main style={{ minHeight: '80vh' }}>{children}</main>
        <footer
          style={{
            textAlign: 'center',
            padding: '1rem 0',
            background: '#f5f5f5',
          }}
        >
          <small>
            © {new Date().getFullYear()} Grupo Mutual. Todos los derechos
            reservados.
          </small>
        </footer>
      </body>
    </html>
  );
}
