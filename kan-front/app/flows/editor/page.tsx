import FlowEditorPageContent from '@/src/views/flow-editor/FlowEditorPage';

// Prevent static generation for this page because it uses useSearchParams
export const dynamic = 'force-dynamic';

export default function FlowEditorPage() {
  return <FlowEditorPageContent />;
}
