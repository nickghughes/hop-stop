import { Socket } from "phoenix";
import store from './store';

let socket = new Socket(process.env.REACT_APP_CHANNEL_ENDPOINT);
socket.connect();

let channel = null;

export function connect_channel(user_id) {
  channel = socket.channel(`user:${user_id}`, {});
  channel.join()
          .receive("ok", () => {
            listen();
          })
          .receive("error", (err) => {
            console.error(err);
          })
}

export function leave_channel() {
  channel.leave();
}

function listen() {
  channel.on("friend_request_received", request => {
    let friends1 = Object.assign({}, store.getState()?.friends || {});
    let pending_requests = (friends1.pending_requests || []).concat([request]);
    friends1.pending_requests = pending_requests;
    let action = {
      type: "friends/set",
      data: friends1
    }
    store.dispatch(action);   
  });

  channel.on("friend_request_responded", payload => {
    let friends1 = Object.assign({}, store.getState()?.friends || {});
    let friends_list = friends1.friends || [];
    if (payload.response) {
      let addedFriend = friends1.pending_friends.find(fr => fr.id === payload.id);
      friends_list.push({
        id: addedFriend.user_id,
        name: addedFriend.name,
        email: addedFriend.email
      });
      friends1.friends = friends_list;
    }
    let pending_friends = (friends1.pending_friends || []).filter(fr => fr.id !== payload.id);
    friends1.pending_friends = pending_friends;
    let action = {
      type: "friends/set",
      data: friends1
    }
    store.dispatch(action);
  });

  channel.on("meet_me_here_received", invite => {
    let meets1 = Object.assign({}, store.getState()?.meetMeHeres || {});
    let incoming = meets1.incoming || [];
    incoming.push(invite);
    meets1.incoming = incoming;
    let action = {
      type: "meetMeHeres/set",
      data: meets1
    }
    store.dispatch(action);
  });
}