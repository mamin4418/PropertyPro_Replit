import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, 'PPP') // 'PPP' is a format string for date-fns that formats dates like "April 29, 2022"
}

/**
 * Generic API request function for API interactions
 * @param endpoint The API endpoint
 * @param method HTTP method
 * @param data Optional data to send
 * @returns Promise with the response data
 */
export async function apiRequest(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(endpoint, options)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `Request failed with status ${response.status}`
    )
  }

  // For DELETE requests that return 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}
