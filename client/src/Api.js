import axios from 'axios';

const instance = axios.create({
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

const Api = {
  assets: {
    create(data) {
      return instance.post('/api/assets', data);
    },
    upload(url, headers, file) {
      return instance.put(url, file, { headers });
    },
  },
  auth: {
    login(email, password) {
      return instance.post('/api/auth/login', { email, password });
    },
    logout() {
      return instance.get('/api/auth/logout');
    },
    register(data) {
      return instance.post('/api/auth/register', data);
    },
  },

  visits: {
    index(params) {
      const { programId, locationId } = params ?? {};
      return instance.get('/api/visits', { params: { programId, locationId } });
    },
    get(id) {
      return instance.get(`/api/visits/${id}`);
    },
    create(data) {
      return instance.post(`/api/visits`, data);
    },
    update(id, data) {
      return instance.patch(`/api/visits/${id}`, data);
    },
    signout(id) {
      return instance.patch(`/api/visits/${id}/sign-out`);
    },
    delete(id) {
      return instance.delete(`/api/visits/${id}`);
    },
  },
  locations: {
    index() {
      return instance.get('/api/locations');
    },
    get(id) {
      return instance.get(`/api/locations/${id}`);
    },
    create(data) {
      return instance.post('/api/locations', data);
    },
    update(id, data) {
      return instance.patch(`/api/locations/${id}`, data);
    },
    delete(id) {
      return instance.delete(`/api/locations/${id}`);
    },
  },
  programs: {
    index() {
      return instance.get('/api/programs');
    },
    get(id) {
      return instance.get(`/api/programs/${id}`);
    },
    create(data) {
      return instance.post('/api/programs', data);
    },
    update(id, data) {
      return instance.patch(`/api/programs/${id}`, data);
    },
    delete(id) {
      return instance.delete(`/api/programs/${id}`);
    },
  },
  passwords: {
    reset(email) {
      return instance.post('/api/passwords', { email });
    },
    get(token) {
      return instance.get(`/api/passwords/${token}`);
    },
    update(token, password) {
      return instance.patch(`/api/passwords/${token}`, { password });
    },
  },
  users: {
    me() {
      return instance.get('/api/users/me');
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
  },
};

export default Api;
