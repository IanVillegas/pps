import type { ReactNode } from 'react';
import AuthenticatedShell from '@/components/Templates/AuthenticatedShell/AuthenticatedShell';

// Grupo de rutas (los parentesis no entran en la URL: sigue siendo /inicio y
// /mi-declaracion/[paso]) para que /inicio y /mi-declaracion compartan UN
// solo layout. Antes cada uno tenia su propio layout.tsx con su propio
// AuthenticatedShell/AppShell: al navegar entre ambos, Next.js desmontaba
// por completo el shell anterior y montaba uno nuevo, perdiendo el estado de
// React del sidebar (`sidebarCollapsed` volvia a su valor inicial). Eso
// causaba dos bugs reportados por el usuario: en escritorio, un sidebar
// colapsado a mano se re-abria solo al cambiar de pantalla; en tablet, cada
// cambio de pantalla mostraba un parpadeo (abre y se cierra de inmediato)
// porque el primer render usaba el estado inicial (expandido) antes de que
// el efecto de matchMedia lo volviera a colapsar. Con un layout compartido,
// AppShell se monta una sola vez y solo cambia `children`.

// (app) porque así es como Next.js permite que dos rutas compartan un mismo layout sin que un layout.tsx en la raíz
// también envuelva el login. /inicio y /mi-declaracion/[paso] son rutas hijas de (app) y comparten este layout.tsx, que
// a su vez envuelve a AuthenticatedShell. El layout de login está en src/app/layout.tsx, que es el layout de la raíz y
// no envuelve a (app).

export default function AppRouteGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
