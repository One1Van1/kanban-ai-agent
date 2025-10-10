'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAgentsStore } from '@/src/lib/stores/agents-store';
import { Bot, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateAgentPage() {
  const router = useRouter();
  const { createAgent, isLoading } = useAgentsStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    model: 'claude-3-haiku-20240307',
    temperature: 0.7,
    maxTokens: 1000,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const agentData = {
        ...formData,
        userId: 'system', // Временно используем system как userId
      };
      console.log('Sending agent data:', agentData); // Для отладки
      await createAgent(agentData);
      toast.success('Agent created successfully!');
      router.push('/agents');
    } catch (error: any) {
      console.error('Failed to create agent:', error); // Для отладки
      toast.error(error.message || 'Failed to create agent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    AI Kanban Agent
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/agents">
                <Button variant="default">Agents</Button>
              </Link>
              <Link href="/kanban">
                <Button variant="ghost">Kanban</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/agents">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Agent</h1>
          <p className="mt-2 text-gray-600">
            Set up a new AI agent to automate your Kanban workflow
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
            <CardDescription>
              Define the basic properties and behavior of your AI agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Agent Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., QA Automation Agent"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Describe what this agent does..."
                  rows={3}
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions *</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    handleInputChange('instructions', e.target.value)
                  }
                  placeholder="Provide detailed instructions for this agent..."
                  rows={5}
                  className={errors.instructions ? 'border-red-500' : ''}
                />
                {errors.instructions && (
                  <p className="text-sm text-red-600">{errors.instructions}</p>
                )}
                <p className="text-sm text-gray-500">
                  Example: "When a task moves to 'In Progress', write a comment
                  encouraging the team and asking if they need any help."
                </p>
              </div>
              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link href="/agents">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Agent
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
