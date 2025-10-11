'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    try {
      setLoading(true);
      setResult('Loading...');

      console.log('🧪 Testing API connection...');

      const response = await fetch('http://localhost:3000/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log(
        '📋 Response headers:',
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Data received:', data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <button
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>

      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {result || 'Click "Test API" to start'}
      </pre>
    </div>
  );
}
