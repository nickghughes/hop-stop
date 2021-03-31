import { clear_banners, dispatch_banners } from './store';
import store from './store';
import { uniqBy } from 'lodash';

function tokenHeader() {
  let token = store.getState()?.session?.token;
  return token ? {
    'Authorization': `Bearer ${token}`
  } : {}
}

function api_path() {
  return process.env.REACT_APP_API_URL + "/api/v1";
}

async function api_get(path) {
  let text = await fetch(
    api_path() + path, {
      headers: tokenHeader()
    });
  let resp = await text.json();
  return resp;
}

async function api_post(path, data) {
  let opts = {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader()),
    body: JSON.stringify(data),
  };
  let text = await fetch(
    api_path() + path, opts);
  let resp = await text.json();
  console.log(resp);
  return resp;
}

async function api_patch(path, data) {
  let opts = {
    method: 'PATCH',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader()),
    body: JSON.stringify(data),
  };
  let text = await fetch(
    api_path() + path, opts);
  let resp = await text.json();
  return resp;
}

async function api_delete(path) {
  let opts = {
    method: 'DELETE',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader())
  };
  await fetch(api_path() + path, opts);
}

export async function api_login(email, password) {
  return api_post("/session", {email, password}).then((data) => {
    clear_banners();
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    dispatch_banners(data);
    return data;
  });
}

export async function api_register(user) {
  let userData = new FormData();
  userData.append("user[email]", user.email);
  userData.append("user[name]", user.name);
  userData.append("user[password]", user.password);
  if (user.pfp) userData.append("user[pfp]", user.pfp);
  let opts = {
    method: 'POST',
    headers: Object.assign(tokenHeader()),
    body: userData
  };
  let text = await fetch(api_path() + "/users", opts);
  let data = await text.json();
  clear_banners();
  if (data.session) {
    let action = {
      type: 'session/set',
      data: data.session,
    }
    store.dispatch(action);
  }
  dispatch_banners(data);
  return data;
}

export async function fetch_profile() {
  let user_id = store.getState()?.session?.user_id;
  if (!user_id) return user_id;
  let data = await api_get(`/users/${user_id}`);
  if (data.user) {
    let action = {
      type: 'user/set',
      data: data.user
    }
    store.dispatch(action);
  }
  dispatch_banners(data);
  return data;
}

export async function edit_profile(user) {
  let userData = new FormData();
  userData.append("user[email]", user.email);
  userData.append("user[name]", user.name);
  userData.append("user[bio]", user.bio);
  if (user.pfp) userData.append("user[pfp]", user.pfp);
  let opts = {
    method: 'PATCH',
    headers: Object.assign(tokenHeader()),
    body: userData
  };
  let text = await fetch(api_path() + `/users/${user.id}`, opts);
  let data = await text.json();
  clear_banners();
  if (data.user) {
    let action = {
      type: 'user/set',
      data: data.user,
    }
    store.dispatch(action);

    action = {
      type: 'success/set',
      data: 'Profile updated successfully.'
    }
    store.dispatch(action);
  }
  dispatch_banners(data);
  return data;
}

export async function fetch_breweries(args) {
  let query_str = Object.keys(args)
    .map(arg => `${encodeURIComponent(arg)}=${encodeURIComponent(args[arg])}`)
    .join("&");
  console.log(query_str);
  return api_get(`/breweries?${query_str}`).then((data) => {
    if (data.data) {
      let data1 = data.data;
      let breweriesToShow = uniqBy(data.data.results, b => b.id);
      data1.results = breweriesToShow;
      let action = {
        type: 'results/set',
        data: data1
      }
      store.dispatch(action);
    }
  })
}

export async function next_breweries() {
  let results = store.getState()?.results;
  if (!results) return;
  console.log("results", results)
  let query_str = `query=${results.query}&page=${results.page}`;
  console.log(query_str);
  return api_get(`/breweries?${query_str}`).then((data) => {
    if (data.data) {
      let breweries = results.results;
      breweries = uniqBy(breweries.concat(data.data.results), b => b.id);
      let action = {
        type: 'results/set',
        data: {page: data.data.page, query: data.data.query, results: breweries}
      }
      store.dispatch(action);
    }
    return data;
  })
}

export function pfp_path(hash) {
  return process.env.REACT_APP_API_URL + `/photos/${hash}`;
}

export function init_state() {
}