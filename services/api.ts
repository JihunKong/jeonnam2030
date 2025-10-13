// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Research Group interface
export interface ResearchGroup {
  id: string;
  name: string;
  description: string;
  howToJoin: string;
  docsLink: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to handle API errors
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Convert snake_case from backend to camelCase for frontend
function convertToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map(convertToCamelCase);
  }

  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const converted: any = {};
    for (const key in data) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

      // Convert date strings to Date objects
      if ((camelKey === 'createdAt' || camelKey === 'updatedAt') && typeof data[key] === 'string') {
        converted[camelKey] = new Date(data[key]);
      } else {
        converted[camelKey] = convertToCamelCase(data[key]);
      }
    }
    return converted;
  }

  return data;
}

// Convert camelCase from frontend to snake_case for backend
function convertToSnakeCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map(convertToSnakeCase);
  }

  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const converted: any = {};
    for (const key in data) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      converted[snakeKey] = convertToSnakeCase(data[key]);
    }
    return converted;
  }

  return data;
}

// Password verification is now handled by the backend
// This function is kept for compatibility but doesn't actually verify locally
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Password verification will be done by the backend on update/delete
  // This is just a stub to maintain API compatibility
  return true;
}

// Create a new research group
export async function createResearchGroup(
  data: Omit<ResearchGroup, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string }
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/research-groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertToSnakeCase(data)),
    });

    const result = await handleResponse(response);
    return result.id.toString();
  } catch (error) {
    console.error('Error creating research group:', error);
    throw error;
  }
}

// Get all research groups
export async function getAllResearchGroups(): Promise<ResearchGroup[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/research-groups`);
    const data = await handleResponse(response);
    return convertToCamelCase(data);
  } catch (error) {
    console.error('Error getting research groups:', error);
    throw error;
  }
}

// Update a research group
export async function updateResearchGroup(
  id: string,
  data: Partial<Omit<ResearchGroup, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>> & { password: string }
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/research-groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertToSnakeCase(data)),
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error updating research group:', error);
    throw error;
  }
}

// Delete a research group
export async function deleteResearchGroup(id: string, password: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/research-groups/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting research group:', error);
    throw error;
  }
}
