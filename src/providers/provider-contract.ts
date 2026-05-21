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

export interface ProviderError {
  provider: string;
  code: string;
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
