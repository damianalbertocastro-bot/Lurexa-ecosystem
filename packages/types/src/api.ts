export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp?: string;
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  page: number;
  pageSize: number;
  total: number;
};
// packages/types/src/api.ts (or inside index.ts)

