import { Suspense } from 'react';
import Home from '@/components/Pages/Home/Home';

// Suspense: Home usa useSearchParams (para el demo de error de DEC-005B),
// que Next.js exige envolver asi para no forzar toda la ruta a render
// dinamico sin avisar.
export default function InicioPage() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
