import { redirect } from 'next/navigation';
import DeclarationWizard from '@/components/Pages/Declaration/DeclarationWizard/DeclarationWizard';
import { DECLARATION_STEPS } from '@/utils/declarationSteps';

interface PageProps {
  params: Promise<{ paso: string }>;
}

export default async function MiDeclaracionPage({ params }: PageProps) {
  const { paso } = await params;
  const stepId = /^\d+$/.test(paso) ? Number(paso) : NaN;

  // Paso inexistente (0, 13, "abc"...): se lleva al primero en vez de mostrar
  // una pantalla rota o un 404; el borrador no se ve afectado.
  if (!DECLARATION_STEPS.some(step => step.id === stepId)) {
    redirect('/mi-declaracion/1');
  }

  return <DeclarationWizard stepId={stepId} />;
}
