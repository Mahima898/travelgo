import api from './api';


export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};


export const routeService = {
  getAll: (params) => api.get('/routes', { params }),
  getById: (id) => api.get(`/routes/${id}`),
  search: (from, to) =>
    api.get('/routes/search', { params: { from, to } }),
  getPopular: () => api.get('/routes/popular'),
  getDestinationNames: () => api.get('/routes/destination-names'),
};


export const stopService = {
  getByRouteId: (routeId) => api.get(`/routes/${routeId}/stops`),
};


export const destinationService = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
};


export const itineraryService = {
  getByRouteId: (routeId) => api.get(`/itineraries/route/${routeId}`),
};


export const tripService = {
  getAll: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  save: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};


export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
};


export const adminService = {
  
  getStats: () => api.get('/admin/stats'),

  
  getRoutes: (params) => api.get('/admin/routes', { params }),
  createRoute: (data) => api.post('/admin/routes', data),
  updateRoute: (id, data) => api.put(`/admin/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/admin/routes/${id}`),

  
  getDestinations: (params) => api.get('/admin/destinations', { params }),
  createDestination: (data) => api.post('/admin/destinations', data),
  updateDestination: (id, data) => api.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id) => api.delete(`/admin/destinations/${id}`),

  
  getAttractions: (params) => api.get('/admin/attractions', { params }),
  createAttraction: (stopId, data) =>
    api.post(`/admin/attractions?stop_id=${stopId}`, data),
  updateAttraction: (id, data) => api.put(`/admin/attractions/${id}`, data),
  deleteAttraction: (id) => api.delete(`/admin/attractions/${id}`),

  
  getFood: (params) => api.get('/admin/food', { params }),
  createFood: (stopId, data) =>
    api.post(`/admin/food?stop_id=${stopId}`, data),
  updateFood: (id, data) => api.put(`/admin/food/${id}`, data),
  deleteFood: (id) => api.delete(`/admin/food/${id}`),

  
  getTips: (params) => api.get('/admin/tips', { params }),
  createTip: (stopId, data) =>
    api.post(`/admin/tips?stop_id=${stopId}`, data),
  updateTip: (id, data) => api.put(`/admin/tips/${id}`, data),
  deleteTip: (id) => api.delete(`/admin/tips/${id}`),

  
  getItineraries: (params) => api.get('/admin/itineraries', { params }),
  createItinerary: (routeId, name, totalDays) =>
    api.post(`/admin/itineraries?route_id=${routeId}&name=${encodeURIComponent(name)}&total_days=${totalDays}`),
  updateItinerary: (id, data) => api.put(`/admin/itineraries/${id}`, data),
  deleteItinerary: (id) => api.delete(`/admin/itineraries/${id}`),

  
  getUsers: (params) => api.get('/admin/users', { params }),
};