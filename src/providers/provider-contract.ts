export interface ProviderCapabilities {
  supportsStreaming: boolean;
  supportsToolCalling: boolean;
  supportsReasoning: boolean;
  supportsVision: boolean;
  maxContextTokens: number;
  localOnly: boolean;
  costProfile: 'free' | 'low' | 'medium' | 'high' | 'unknown';
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  retry?: {
    maxAttempts: number;
    backoffMs: number;
  };
  fallbackModels?: string[];
}

export interface ChatResponse {
  provider: string;
  model?: string;
  content: string;
  finishReason: 'stop' | 'length' | 'tool_call' | 'error';
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export type ProviderStreamEvent =
  | { type: 'start'; provider: string; model?: string }
  | { type: 'delta'; text: string }
  | { type: 'finish'; finishReason: ChatResponse['finishReason'] }
  | { type: 'error'; message: string; retriable: boolean };

export type ProviderErrorCode =
  | 'PROVIDER_AUTH'
  | 'PROVIDER_RATE_LIMIT'
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_NETWORK'
  | 'PROVIDER_BAD_REQUEST'
  | 'PROVIDER_UNAVAILABLE'
  | 'PROVIDER_UNKNOWN'
  | 'MOCK_PROVIDER_ERROR'
  | 'SCRIPTED_PROVIDER_ERROR';

export interface ProviderError {
  provider: string;
  code: ProviderErrorCode;
  message: string;
  retriable: boolean;
}

export interface ProviderClient {
  id: string;
  displayName: string;
  capabilities: ProviderCapabilities;
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream(request: ChatRequest): AsyncIterable<ProviderStreamEvent>;
  countTokens(input: string): Promise<{ tokens: number; approximate: boolean }>;
  normalizeError(error: unknown): ProviderError;
}
