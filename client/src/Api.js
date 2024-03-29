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

function parseLinkHeader(response) {
  const link = response.headers?.link;
  if (link) {
    const linkRe = /<([^>]+)>; rel="([^"]+)"/g;
    const urls = {};
    let m;
    while ((m = linkRe.exec(link)) !== null) {
      let url = m[1];
      urls[m[2]] = url;
    }
    return urls;
  }
  return null;
}

const Api = {
  parseLinkHeader,
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
      const { from, to, programId, locationId, page, timeZone } = params ?? {};
      return instance.get('/api/visits', { params: { from, to, programId, locationId, page, timeZone } });
    },
    search(phoneNumber) {
      return instance.get('/api/visits/search', { params: { phoneNumber } });
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
    setup(id) {
      return instance.get(`/api/locations/${id}/setup`);
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
  invites: {
    index() {
      return instance.get(`/api/invites`);
    },
    create(data) {
      return instance.post('/api/invites', data);
    },
    get(id) {
      return instance.get(`/api/invites/${id}`);
    },
    accept(id, data) {
      return instance.post(`/api/invites/${id}/accept`, data);
    },
    resend(id) {
      return instance.post(`/api/invites/${id}/resend`);
    },
    revoke(id) {
      return instance.delete(`/api/invites/${id}`);
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
    index() {
      return instance.get(`/api/users`);
    },
    me() {
      return instance.get('/api/users/me');
    },
    get(id) {
      return instance.get(`/api/users/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
  },
};

export default Api;
