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

  // Log detailed request information
  console.log('=== MCP Request Details ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', axiosConfig.method || 'GET');
  console.log('URL:', axiosConfig.url);
  console.log('Headers:', JSON.stringify(axiosConfig.headers, null, 2));
  console.log('Query Parameters:', JSON.stringify(axiosConfig.params, null, 2));

  if (axiosConfig.data) {
    console.log('Request Body:', JSON.stringify(axiosConfig.data, null, 2));
  }

  console.log('========================');

  const response = await axios(axiosConfig);

  // Log response details
  console.log('=== MCP Response Details ===');
  console.log('Status:', response.status, response.statusText);
  console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
  console.log('Response Data:', JSON.stringify(response.data, null, 2));
  console.log('=========================');

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