'use client';

import React from 'react';
import { AgentCreateForm } from './components/AgentCreateForm';
import { useAgentCreate } from './hooks/useAgentCreate';

export default function AgentCreatePageContent() {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } =
    useAgentCreate();

  return (
    <AgentCreateForm
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
}
