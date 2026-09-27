const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorMsg = `API Error: ${res.statusText} (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData?.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return await res.json() as T;
  } catch (err: any) {
    console.error(`API Call Failed: ${endpoint}`, err);
    throw err;
  }
}

// Products API
export const getProducts = (params?: Record<string, any>) => {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
  }
  return fetchApi<any>(`/products?${query.toString()}`);
};

export const getProductBySlug = (slug: string) => fetchApi<any>(`/products/slug/${slug}`);
export const getProductById = (id: number) => fetchApi<any>(`/products/${id}`);
export const createProduct = (data: any) => fetchApi<any>('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id: number, data: any) => fetchApi<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id: number) => fetchApi<any>(`/products/${id}`, { method: 'DELETE' });

// Orders API
export const getOrders = (status?: string) => {
  const q = status ? `?status=${status}` : '';
  return fetchApi<any[]>(`/orders${q}`);
};
export const getOrderById = (id: number) => fetchApi<any>(`/orders/${id}`);
export const getOrderByNumber = (num: string) => fetchApi<any>(`/orders/by-number/${num}`);
export const createOrder = (orderData: any) => fetchApi<any>('/orders', { method: 'POST', body: JSON.stringify(orderData) });
export const updateOrderStatus = (id: number, status: string, tracking?: string) => 
  fetchApi<any>(`/orders/${id}/status`, { 
    method: 'PUT', 
    body: JSON.stringify({ order_status: status, tracking_number: tracking }) 
  });

// Cart API
export const getCart = (sessionId = 'default_session') => fetchApi<any>(`/cart?session_id=${sessionId}`);
export const addToCart = (productId: number, quantity = 1, sessionId = 'default_session') => 
  fetchApi<any>('/cart', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity, session_id: sessionId }) });
export const updateCartItem = (itemId: number, quantity: number) => 
  fetchApi<any>(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
export const removeCartItem = (itemId: number) => fetchApi<any>(`/cart/${itemId}`, { method: 'DELETE' });
export const clearCart = (sessionId = 'default_session') => fetchApi<any>(`/cart?session_id=${sessionId}`, { method: 'DELETE' });

// Intelligence & Dashboard API
export const getDashboardMetrics = () => fetchApi<any>('/intelligence/dashboard');
export const getDemandIntelligence = () => fetchApi<any>('/intelligence/demand');

// AI & Copilot API
export const aiEvaluateNegotiation = (data: any) => fetchApi<any>('/negotiations/evaluate', { method: 'POST', body: JSON.stringify(data) });
export const getNegotiations = () => fetchApi<any[]>('/negotiations');
export const aiChatCopilot = (message: string, language: string) => 
  fetchApi<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, language }) });
export const aiSimulateCampaign = (data: any) => fetchApi<any>('/ai/simulate-campaign', { method: 'POST', body: JSON.stringify(data) });

// Notifications API
export const getNotifications = (unreadOnly = false) => fetchApi<any[]>(`/notifications?unread_only=${unreadOnly}`);
export const markNotificationRead = (id: number) => fetchApi<any>(`/notifications/${id}/read`, { method: 'PUT' });
export const markAllNotificationsRead = () => fetchApi<any>('/notifications/read-all', { method: 'POST' });

// WhatsApp API
export const getWhatsAppMessages = () => fetchApi<any[]>('/whatsapp/messages');
export const getWhatsAppSettings = () => fetchApi<any>('/whatsapp/settings');
export const updateWhatsAppSettings = (data: any) => fetchApi<any>('/whatsapp/settings', { method: 'POST', body: JSON.stringify(data) });
export const sendWhatsAppMessage = (data: any) => fetchApi<any>('/whatsapp/send', { method: 'POST', body: JSON.stringify(data) });

// Artisans API
export const getArtisans = () => fetchApi<any[]>('/artisans');
export const registerArtisan = (data: any) => fetchApi<any>('/artisans', { method: 'POST', body: JSON.stringify(data) });
