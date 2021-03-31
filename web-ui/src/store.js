import { createStore, combineReducers } from 'redux';

function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60*60*1000;
  if (age < 24 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function session(state = load_session(), action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      localStorage.removeItem("session");
      return null;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case 'error/set':
      return action.data;
    case 'banners/clear':
      return null;
    case 'session/clear':
      return null;
    default:
      return state;
  }
}

function info(state = null, action) {
  switch (action.type) {
    case 'info/set':
      return action.data;
    case 'session/clear':
      return "Logged out.";
    case 'banners/clear':
      return null;
    default:
      return state;
  }
}

function success(state = null, action) {
  switch (action.type) {
    case 'success/set':
      return action.data;
    case 'banners/clear':
      return null;
    case 'session/clear':
      return null;
    default:
      return state;
  }
}

function user(state = null, action) {
  switch (action.type) {
    case 'user/set':
      return action.data;
    case 'session/clear':
      return null;
    default:
      return state;
  }
}

function results(state = null, action) {
  switch (action.type) {
    case 'results/set':
      return action.data;
    case 'session/clear':
      return null;
    default:
      return state;
  }
}

function breweries(state = null, action) {
  switch (action.type) {
    case 'results/set':
      return action.data.results;
    case 'filters/set':
      return null;
    case 'session/clear':
      return null;
    default:
      return state;
  }
}

function coords(state = null, action) {
  switch (action.type) {
    case 'filters/set':
      return action.data.coords || null;
    default:
      return state;
  }
}

function filters(state = {}, action) {
  switch (action.type) {
    case 'filters/set':
      console.log(action.data);
      return action.data;
    case 'session/clear':
      return {};
    default:
      return state;
  }
}

function root_reducer(state, action) {
  let redu = combineReducers(
    {session, error, info, success, user, results, breweries, coords, filters}
  );

  return redu(state, action);
}

export function clear_banners() {
  store.dispatch({type: 'banners/clear', data: {}})
}

export function dispatch_banners(data) {
  if (data.error) {
    store.dispatch({
      type: 'error/set',
      data: data.error
    });
  }
  if (data.info) {
    store.dispatch({
      type: 'info/set',
      data: data.info
    });
  }
  if (data.success) {
    store.dispatch({
      type: 'success/set',
      data: data.success
    });
  }
}

let store = createStore(root_reducer);
export default store;