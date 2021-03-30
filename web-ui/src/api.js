import { clear_banners, dispatch_banners } from './store';
import store from './store';

function tokenHeader() {
  let token = store.getState()?.session?.token;
  return token ? {
    'Authentication': `Bearer ${token}`
  } : {}
}

async function api_get(path) {
  let text = await fetch(
    process.env.REACT_APP_API_URL + path, {
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
    process.env.REACT_APP_API_URL + path, opts);
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
    process.env.REACT_APP_API_URL + path, opts);
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
  await fetch(process.env.REACT_APP_API_URL + path, opts);
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
  userData.append("user[pfp]", user.pfp);
  let opts = {
    method: 'POST',
    headers: Object.assign(tokenHeader()),
    body: userData
  };
  let text = await fetch(process.env.REACT_APP_API_URL + "/users", opts);
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