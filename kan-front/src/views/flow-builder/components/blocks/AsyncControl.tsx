import React from 'react';
import { Checkbox } from '@/src/shared/components/ui/checkbox';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { Clock, AlertCircle } from 'lucide-react';

interface AsyncControlProps {
  config: {
    waitForResponse?: boolean;
    timeout?: number;
    timeoutUnit?: 'seconds' | 'minutes' | 'hours';
    onTimeout?: 'fail' | 'continue' | 'retry';
  };
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
}

/**
 * Universal component for embedding "Wait for Response" functionality
 * Used in ActionBlock for AI Request, API Call, MCP Operation
 */
export function AsyncControl({
  config,
  onChange,
  disabled = false,
}: AsyncControlProps) {
  const defaultTimeout = config.timeout || 30;
  const defaultUnit = config.timeoutUnit || 'seconds';

  return (
    <div className="space-y-3 rounded-md border border-blue-200 bg-blue-50/50 p-3">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-blue-900">
          Async Execution Control
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="waitForResponse"
          checked={config.waitForResponse !== false} // Default to true
          onCheckedChange={(checked: boolean) =>
            onChange('waitForResponse', checked === true)
          }
          disabled={disabled}
        />
        <Label
          htmlFor="waitForResponse"
          className="text-sm font-normal text-gray-700 cursor-pointer"
        >
          Wait for response before continuing
        </Label>
      </div>

      {config.waitForResponse !== false && (
        <div className="space-y-3 pl-6">
          {/* Timeout Configuration */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Timeout</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                min="1"
                placeholder="30"
                value={defaultTimeout}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange('timeout', parseInt(e.target.value) || 30)
                }
                disabled={disabled}
                className="h-8 text-sm bg-white flex-1"
              />
              <Select
                value={defaultUnit}
                onValueChange={(value: string) =>
                  onChange('timeoutUnit', value)
                }
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-[110px] text-sm bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* On Timeout Action */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">On Timeout</Label>
            <Select
              value={config.onTimeout || 'fail'}
              onValueChange={(value: string) => onChange('onTimeout', value)}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 text-sm bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fail">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span>Fail Flow</span>
                  </div>
                </SelectItem>
                <SelectItem value="continue">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">⚠</span>
                    <span>Continue Anyway</span>
                  </div>
                </SelectItem>
                <SelectItem value="retry">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">↻</span>
                    <span>Retry Request</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-gray-500 flex items-start space-x-1">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              Flow execution will pause until response arrives or timeout is
              reached
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
