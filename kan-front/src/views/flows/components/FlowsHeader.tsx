import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import { Workflow, Settings } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';

export function FlowsHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('flows.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('flows.subtitle')}</p>
      </div>
      <div className="flex gap-3">
        <Link href="/agents/flow-builder">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            🎨 Flow Builder
          </Button>
        </Link>
      </div>
    </div>
  );
}
