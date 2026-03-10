export interface User {
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface Credentials {
  access_token?: string;
  api_key?: string;
  [key: string]: unknown;
}
