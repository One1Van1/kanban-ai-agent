'use client';

import React from 'react';
import { Node } from '@xyflow/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import { Textarea } from '@/src/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { X, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  blockId: string;
  nodes: Node[];
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function PropertiesPanel({
  blockId,
  nodes,
  onUpdateNode,
  onClose,
}: PropertiesPanelProps) {
  const node = nodes.find((n) => n.id === blockId);

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No block selected
      </div>
    );
  }

  const getConfig = (key?: string): any => {
    const config = (node.data.config || {}) as Record<string, any>;
    return key ? config[key] : config;
  };

  const updateConfig = (key: string, value: any) => {
    onUpdateNode(blockId, {
      config: {
        ...(node.data.config || {}),
        [key]: value,
      },
    });
  };

  const updateName = (name: string) => {
    onUpdateNode(blockId, { name });
  };

  const renderTriggerProperties = () => {
    if (node.data.type === 'board_move' || node.data.type === 'board_create') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="boardType">Board Type</Label>
            <Select
              value={(node.data.config as any)?.boardType || 'jira'}
              onValueChange={(value) => updateConfig('boardType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select board type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jira">Jira (Atlassian)</SelectItem>
                <SelectItem value="trello">Trello</SelectItem>
                <SelectItem value="asana">Asana</SelectItem>
                <SelectItem value="notion">Notion</SelectItem>
                <SelectItem value="monday">Monday.com</SelectItem>
                <SelectItem value="clickup">ClickUp</SelectItem>
                <SelectItem value="generic">Generic Board</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {node.data.type !== 'board_move' &&
            node.data.type !== 'board_create' && (
              <div>
                <Label htmlFor="event">Event</Label>
                <Select
                  value={(node.data.config as any)?.event || 'card_moved'}
                  onValueChange={(value) => updateConfig('event', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card_moved">Card Moved</SelectItem>
                    <SelectItem value="card_created">Card Created</SelectItem>
                    <SelectItem value="card_updated">Card Updated</SelectItem>
                    <SelectItem value="card_assigned">Card Assigned</SelectItem>
                    <SelectItem value="card_completed">
                      Card Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

          {node.data.type === 'board_move' && (
            <>
              <div>
                <Label htmlFor="sourceColumn">Source Column (optional)</Label>
                <Input
                  id="sourceColumn"
                  value={(node.data.config as any)?.sourceColumn || ''}
                  onChange={(e) => updateConfig('sourceColumn', e.target.value)}
                  placeholder="From which column"
                />
              </div>

              <div>
                <Label htmlFor="targetColumn">Target Column</Label>
                <Input
                  id="targetColumn"
                  value={(node.data.config as any)?.targetColumn || ''}
                  onChange={(e) => updateConfig('targetColumn', e.target.value)}
                  placeholder="To which column"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="boardConnection">Board Connection (optional)</Label>
            <Input
              id="boardConnection"
              value={(node.data.config as any)?.boardConnection || ''}
              onChange={(e) => updateConfig('boardConnection', e.target.value)}
              placeholder="Connection ID or URL"
            />
          </div>
        </div>
      );
    }

    if (node.data.type === 'webhook') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={(node.data.config as any)?.webhookUrl || ''}
              onChange={(e) => updateConfig('webhookUrl', e.target.value)}
              placeholder="https://your-webhook-endpoint.com"
            />
          </div>

          <div>
            <Label htmlFor="webhookSecret">Webhook Secret (optional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              value={(node.data.config as any)?.webhookSecret || ''}
              onChange={(e) => updateConfig('webhookSecret', e.target.value)}
              placeholder="Webhook verification secret"
            />
          </div>
        </div>
      );
    }

    if (node.data.type === 'time_based') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="scheduleType">Schedule Type</Label>
            <Select
              value={(node.data.config as any)?.schedule?.type || 'interval'}
              onValueChange={(value) =>
                updateConfig('schedule', {
                  ...(node.data.config as any)?.schedule,
                  type: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interval">
                  Interval (every X minutes)
                </SelectItem>
                <SelectItem value="cron">Cron Expression</SelectItem>
                <SelectItem value="once">Once at specific time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduleExpression">Schedule Expression</Label>
            <Input
              id="scheduleExpression"
              value={(node.data.config as any)?.schedule?.expression || ''}
              onChange={(e) =>
                updateConfig('schedule', {
                  ...(node.data.config as any)?.schedule,
                  expression: e.target.value,
                })
              }
              placeholder="*/5 * * * * (every 5 min) or 0 9 * * MON-FRI"
            />
          </div>
        </div>
      );
    }

    return null;
  };
  const renderContextProperties = () => {
    if (node.data.type === 'extract_files') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="variableName">Variable Name</Label>
            <Input
              id="variableName"
              value={getConfig('variableName') || ''}
              onChange={(e) => updateConfig('variableName', e.target.value)}
              placeholder="Enter variable name"
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Select
              value={getConfig('source') || 'card_attachments'}
              onValueChange={(value) => updateConfig('source', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card_attachments">
                  Card Attachments
                </SelectItem>
                <SelectItem value="card_fields">Card Fields</SelectItem>
                <SelectItem value="api_call">API Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fileType">File Types (comma separated)</Label>
            <Input
              id="fileType"
              value={getConfig('filter')?.fileType?.join(', ') || ''}
              onChange={(e) => {
                const types = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                updateConfig('filter', {
                  ...(getConfig('filter') || {}),
                  fileType: types,
                });
              }}
              placeholder="jpg, png, pdf"
            />
          </div>

          <div>
            <Label htmlFor="uploadedBy">Uploaded By (optional)</Label>
            <Input
              id="uploadedBy"
              value={getConfig('filter')?.uploadedBy || ''}
              onChange={(e) =>
                updateConfig('filter', {
                  ...(getConfig('filter') || {}),
                  uploadedBy: e.target.value,
                })
              }
              placeholder="Username or ID"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLogicProperties = () => {
    if (node.data.type === 'if_else') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="variable">Variable to Check</Label>
            <Input
              id="variable"
              value={getConfig('condition')?.variable || ''}
              onChange={(e) =>
                updateConfig('condition', {
                  ...getConfig('condition'),
                  variable: e.target.value,
                })
              }
              placeholder="Variable name"
            />
          </div>

          <div>
            <Label htmlFor="operator">Operator</Label>
            <Select
              value={getConfig('condition')?.operator || 'exists'}
              onValueChange={(value) =>
                updateConfig('condition', {
                  ...getConfig('condition'),
                  operator: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exists">Exists (not empty)</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {['equals', 'contains', 'greater', 'less'].includes(
            getConfig('condition')?.operator,
          ) && (
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={getConfig('condition')?.value || ''}
                onChange={(e) =>
                  updateConfig('condition', {
                    ...getConfig('condition'),
                    value: e.target.value,
                  })
                }
                placeholder="Comparison value"
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderActionProperties = () => {
    if (node.data.type === 'ai_request') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="aiModel">AI Model</Label>
            <Select
              value={getConfig('aiModel') || 'claude'}
              onValueChange={(value) => updateConfig('aiModel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gpt">GPT</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={getConfig('prompt') || ''}
              onChange={(e) => updateConfig('prompt', e.target.value)}
              placeholder="Enter AI prompt"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="attachments">
              Attachments (variable names, comma separated)
            </Label>
            <Input
              id="attachments"
              value={getConfig('attachments')?.join(', ') || ''}
              onChange={(e) => {
                const attachments = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                updateConfig('attachments', attachments);
              }}
              placeholder="userPhotos, documents"
            />
          </div>
        </div>
      );
    }

    if (node.data.type === 'create_file') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={getConfig('fileName') || ''}
              onChange={(e) => updateConfig('fileName', e.target.value)}
              placeholder="report.docx"
            />
          </div>

          <div>
            <Label htmlFor="fileFormat">File Format</Label>
            <Select
              value={getConfig('fileFormat') || 'docx'}
              onValueChange={(value) => updateConfig('fileFormat', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="xlsx">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fileContent">File Content</Label>
            <Textarea
              id="fileContent"
              value={getConfig('fileContent') || ''}
              onChange={(e) => updateConfig('fileContent', e.target.value)}
              placeholder="{{aiResponse}} or static content"
              rows={4}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderWaitProperties = () => {
    if (node.data.type === 'wait_response') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="waitFor">Wait For</Label>
            <Select
              value={getConfig('waitFor') || 'ai_response'}
              onValueChange={(value) => updateConfig('waitFor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select what to wait for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai_response">AI Response</SelectItem>
                <SelectItem value="user_action">User Action</SelectItem>
                <SelectItem value="time_delay">Time Delay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeout">Timeout (milliseconds)</Label>
            <Input
              id="timeout"
              type="number"
              value={getConfig('timeout') || 300000}
              onChange={(e) =>
                updateConfig('timeout', parseInt(e.target.value))
              }
              placeholder="300000"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">Properties</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Block Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Block Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="blockName">Name</Label>
              <Input
                id="blockName"
                value={(node.data.name as string) || ''}
                onChange={(e) => updateName(e.target.value)}
                placeholder="Block name"
              />
            </div>
            <div>
              <Label>Type</Label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {node.data.type as string}
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {node.type}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Properties */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {node.type === 'trigger' && renderTriggerProperties()}
            {node.type === 'context' && renderContextProperties()}
            {node.type === 'logic' && renderLogicProperties()}
            {node.type === 'action' && renderActionProperties()}
            {node.type === 'wait' && renderWaitProperties()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
