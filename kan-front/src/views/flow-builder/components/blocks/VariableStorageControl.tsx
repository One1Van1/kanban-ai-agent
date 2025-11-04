import React from 'react';
import { Checkbox } from '@/src/shared/components/ui/checkbox';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import { Variable } from 'lucide-react';

interface VariableStorageControlProps {
  config: {
    saveToVariable?: boolean;
    variableName?: string;
  };
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
}

/**
 * Universal component for embedding "Save to Variable" functionality
 * Can be added to any block (Trigger, Context, Logic, Action, Wait)
 */
export function VariableStorageControl({
  config,
  onChange,
  disabled = false,
}: VariableStorageControlProps) {
  return (
    <div className="space-y-3 rounded-md border border-purple-200 bg-purple-50/50 p-3">
      <div className="flex items-center space-x-2">
        <Variable className="h-4 w-4 text-purple-600" />
        <Label className="text-sm font-medium text-purple-900">
          Save Result to Variable
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveToVariable"
          checked={config.saveToVariable || false}
          onCheckedChange={(checked: boolean) =>
            onChange('saveToVariable', checked === true)
          }
          disabled={disabled}
        />
        <Label
          htmlFor="saveToVariable"
          className="text-sm font-normal text-gray-700 cursor-pointer"
        >
          Store block output in a variable
        </Label>
      </div>

      {config.saveToVariable && (
        <div className="space-y-1.5 pl-6">
          <Label htmlFor="variableName" className="text-xs text-gray-600">
            Variable Name
          </Label>
          <Input
            id="variableName"
            type="text"
            placeholder="e.g., extracted_text, api_response"
            value={config.variableName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange('variableName', e.target.value)
            }
            disabled={disabled}
            className="h-8 text-sm bg-white"
          />
          <p className="text-xs text-gray-500">
            Use{' '}
            <code className="px-1 py-0.5 bg-gray-100 rounded">
              {'{'}
              {config.variableName || 'variable_name'}
              {'}'}
            </code>{' '}
            in subsequent blocks
          </p>
        </div>
      )}
    </div>
  );
}
