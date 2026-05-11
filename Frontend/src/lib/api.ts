const API_URL = import.meta.env.VITE_API_URL ;

export const apiCall = async (endpoint: string, method: string, body?: any) => {
  const token = localStorage.getItem('token');
  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${baseUrl}${cleanEndpoint}`;

  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Log for debugging (user can see in browser)
  // console.log(`API Call: ${method} ${url} | Token Present: ${!!token} | FormData: ${isFormData}`);

  const response = await fetch(url, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  });




  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || data.error || (data.data && data.data.message) || 'Something went wrong';
    throw new Error(errorMsg);
  }
  return data;

};
