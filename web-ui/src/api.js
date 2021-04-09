import { clear_banners, dispatch_banners } from './store';
import store from './store';
import { connect_channel } from './socket';

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
    init_state();
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
  init_state();
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

function brewery_query_str(args) {
  return Object.keys(args)
    .map(arg => `${encodeURIComponent(arg)}=${encodeURIComponent(typeof args[arg] === 'object' ? 
                                                                  JSON.stringify(args[arg]) : 
                                                                  args[arg])}`)
    .join("&");
}

export async function fetch_breweries(args) {
  if (!args.coords && !args.searchTerm && !args.favorite && !args.locationStr) return;
  let query_str = brewery_query_str(args);
  return api_get(`/breweries?${query_str}`).then((data) => {
    if (data.data) {
      let action = {
        type: 'results/set',
        data: data.data
      }
      store.dispatch(action);
    }
  })
}

export async function next_breweries() {
  let args = store.getState()?.filters;
  let results = store.getState()?.results;
  if (!results || !args) return;
  let query_str = brewery_query_str(Object.assign({}, args, {page: results.page + 1}));
  return api_get(`/breweries?${query_str}`).then((data) => {
    if (data.data) {
      let breweries = results.results.concat(data.data.results);
      let action = {
        type: 'results/set',
        data: Object.assign({}, data.data, { results: breweries })
      }
      store.dispatch(action);
    }
    return data;
  })
}

export async function fetch_brewery(id) {
  let data = await api_get(`/breweries/${id}`);
  if (data.brewery) {
    let action = {
      type: 'brewery/set',
      data: data.brewery
    }
    store.dispatch(action);
  }
  return data;
}

export async function fetch_reviews(breweryId, page) {
  let data = await api_get(`/breweries/${breweryId}/reviews?page=${page}`);
  return data.data;
}

export function favorite_brewery(breweryId, favorite) {
  api_patch(`/breweries/${breweryId}`, { favorite });
}

export async function create_review(breweryId, stars, body) {
  let data = await api_post(`/breweries/${breweryId}/reviews`, { stars: stars, body: body });
  dispatch_banners(data);
  return data.review_id;
}

export async function update_review(reviewId, breweryId, stars, body) {
  let data = await api_patch(`/breweries/${breweryId}/reviews/${reviewId}`, {review: { stars: stars, body: body }})
  dispatch_banners(data);
}

export async function fetch_friends() {
  let data = await api_get(`/friends`);
  let action = {
    type: 'friends/set',
    data: data
  }
  store.dispatch(action);
}

export async function send_friend_request(email) {
  let data = await api_post(`/friends`, {email: email.toLowerCase().trim()})
  
  if (data.friend) {
    let friends1 = Object.assign({}, store.getState()?.friends || {pending_friends: []});
    friends1.pending_friends = friends1.pending_friends.concat([data.friend])

    let action = {
      type: "friends/set",
      data: friends1
    }
    store.dispatch(action);
  }

  dispatch_banners(data);
}

export async function respond_friend_request(request, response) {
  let data = await api_patch(`/friends/${request.id}`, { response });
  dispatch_banners(data);

  let f = store.getState()?.friends;
  if (!f) return;

  let friends1 = Object.assign({}, f);
  friends1.pending_requests = friends1.pending_requests.filter(r => r.id !== request.id);
  if (response) {
    friends1.friends = friends1.friends.concat([{id: request.user_id, name: request.name, email: request.email}])
  }

  let action = {
    type: "friends/set",
    data: friends1
  }
  store.dispatch(action);
}

export async function fetch_meet_me_heres() {
  let data = await api_get(`/meetmeheres`);
  let action = {
    type: 'meetMeHeres/set',
    data: data
  }
  store.dispatch(action);
}

export async function autocomplete_breweries(query) {
  return await api_get(`/autocomplete?query=${query}`);
}

export async function send_meet_me_heres(brewery_id, user_ids) {
  let data = await api_post(`/meetmeheres`, { brewery_id, user_ids });
  dispatch_banners(data);
  return data;
}

export async function dismiss_meet_me_here(meet_id) {
  return await api_patch(`/meetmeheres/${meet_id}`);
}

export function pfp_path(hash) {
  return process.env.REACT_APP_API_URL + `/photos/${hash}`;
}

export function init_state() {
  let user_id = store.getState()?.session?.user_id;
  if (user_id) {
    connect_channel(user_id);
    fetch_profile();
    fetch_friends();
    fetch_meet_me_heres();
  }
}