import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { useTranslation } from '@/src/shared/i18n';

export function AgentsHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('agents.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('agents.subtitle')}</p>
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
        <Link href="/agents/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('agents.createAgent')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
