import FlowBuilderPageContent from '@/src/views/flow-builder/FlowBuilderPage';

// Prevent static generation for this page because it uses useSearchParams
export const dynamic = 'force-dynamic';

export default function FlowBuilderPage() {
  return <FlowBuilderPageContent />;
}
