/**
 * Base URL for API endpoints
 *
 * This constant is currently unused but kept for future API integration.
 * Set NEXT_PUBLIC_BASE_URL environment variable to configure the API base URL.
 *
 * @example
 * // Usage in future API calls:
 * import { baseUrl } from '@/api/ports';
 * const response = await fetch(`${baseUrl}/api/endpoint`);
 */
export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
