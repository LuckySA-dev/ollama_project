/**
 * LLM Provider Abstraction
 * Supports both Ollama (local) and OpenAI (cloud)
 */

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  content: string;
  model: string;
  provider: 'ollama' | 'openai';
}

/**
 * Generate AI response using available LLM provider
 * Priority: OpenAI API (if key exists) → Ollama (local)
 */
export async function generateLLMResponse(
  messages: LLMMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<LLMResponse> {
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 1000;

  // Try OpenAI first (for production/cloud deployment)
  if (process.env.OPENAI_API_KEY) {
    return await generateOpenAIResponse(messages, temperature, maxTokens);
  }

  // Fallback to Ollama (for local development)
  return await generateOllamaResponse(messages, temperature);
}

/**
 * Generate response using OpenAI API
 */
async function generateOpenAIResponse(
  messages: LLMMessage[],
  temperature: number,
  maxTokens: number
): Promise<LLMResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openai',
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate response from OpenAI');
  }
}

/**
 * Generate response using Ollama (local)
 */
async function generateOllamaResponse(
  messages: LLMMessage[],
  temperature: number
): Promise<LLMResponse> {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';

    // Convert messages to single prompt for Ollama
    const prompt = messages
      .map(msg => {
        if (msg.role === 'system') return `System: ${msg.content}`;
        if (msg.role === 'user') return `User: ${msg.content}`;
        return `Assistant: ${msg.content}`;
      })
      .join('\n\n');

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: data.response,
      model: model,
      provider: 'ollama',
    };
  } catch (error) {
    console.error('Ollama API error:', error);
    throw new Error('Failed to generate response from Ollama. Make sure Ollama is running.');
  }
}

/**
 * Simple text generation (backward compatible)
 */
export async function generateResponse(prompt: string): Promise<string> {
  const response = await generateLLMResponse([
    {
      role: 'user',
      content: prompt,
    },
  ]);

  return response.content;
}

/**
 * Check which LLM provider is available
 */
export function getAvailableProvider(): 'openai' | 'ollama' | 'none' {
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_MODEL) {
    return 'ollama';
  }
  return 'none';
}

/**
 * Get provider configuration info
 */
export function getProviderInfo() {
  const provider = getAvailableProvider();
  
  return {
    provider,
    model: provider === 'openai' 
      ? process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      : process.env.OLLAMA_MODEL || 'llama3.1:8b',
    isConfigured: provider !== 'none',
  };
}
