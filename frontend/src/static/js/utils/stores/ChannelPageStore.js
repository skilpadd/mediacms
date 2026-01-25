import EventEmitter from 'events';
import { exportStore, getRequest, deleteRequest, csrfToken } from '../helpers';

import { config as mediacmsConfig } from '../settings/config.js';

class ChannelPageStore extends EventEmitter {
  constructor() {
    super();
    this.mediacms_config = mediacmsConfig(window.MediaCMS);
    this.removeChannelResponse = this.removeChannelResponse.bind(this);
    this.removeChannelFail = this.removeChannelFail.bind(this);
    this.removingChannel = false;
  }

  removeChannelResponse(response) {
    if (response && 204 === response.status) {
      this.emit('channel_delete');
    }
  }

  removeChannelFail() {
    this.emit('channel_delete_fail');
    this.removingChannel = false;
  }

  actions_handler(action) {
    switch (action.type) {
      case 'REMOVE_CHANNEL':
        if (this.removingChannel) {
          return;
        }
        this.removingChannel = true;
        let deleteAPIurl = this.mediacms_config.api.channels + '/' + action.data;
        deleteRequest(
          deleteAPIurl,
          { headers: { 'X-CSRFToken': csrfToken() } },
          false,
          this.removeChannelResponse,
          this.removeChannelFail
        );
        break;
    }
  }
}

export default exportStore(new ChannelPageStore(), 'actions_handler');
