import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const customFetch = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const accessToken = process.env.FREEE_HR_ACCESS_TOKEN;
  const companyId = process.env.FREEE_HR_COMPANY_ID;

  if (!accessToken) {
    throw new Error('FREEE_HR_ACCESS_TOKEN environment variable is required');
  }

  if (!companyId) {
    throw new Error('FREEE_HR_COMPANY_ID environment variable is required');
  }

  const defaultHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const axiosConfig: AxiosRequestConfig = {
    ...options,
    url,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Add company_id to query params if not already present
    params: {
      company_id: companyId,
      ...options.params,
    },
  };

  const response = await axios(axiosConfig);

  // Return a clean response object without circular references
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: {
      url: response.config?.url,
      method: response.config?.method,
      headers: response.config?.headers,
    },
  } as AxiosResponse<T>;
};