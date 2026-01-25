import Dispatcher from '../dispatcher.js';

export function remove_channel(friendly_token) {
  Dispatcher.dispatch({
    type: 'REMOVE_CHANNEL',
    data: friendly_token
  });
}
