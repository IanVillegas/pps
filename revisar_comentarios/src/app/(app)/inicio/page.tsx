import { Suspense } from 'react';
import Home from '@/components/Pages/Home/Home';

export default function InicioPage() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
