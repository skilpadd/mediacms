import React from 'react';
import { ApiUrlConsumer } from '../utils/contexts';
import { PageStore } from '../utils/stores';
import { MediaListWrapper } from '../components/MediaListWrapper';
import ProfilePagesHeader from '../components/profile-page/ProfilePagesHeader';
import ProfilePagesContent from '../components/profile-page/ProfilePagesContent';
import { LazyLoadItemListAsync } from '../components/item-list/LazyLoadItemListAsync.jsx';
import { ProfileMediaPage } from './ProfileMediaPage';

export class ProfileChannelsPage extends ProfileMediaPage {
  constructor(props) {
    super(props, 'author-channels');

    this.state = {
      loadedAuthor: false,
      loadedChannels: false,
      channelsCount: -1,
    };

    this.getChannelsCountFunc = this.getChannelsCountFunc.bind(this);
  }

  getChannelsCountFunc(resultsCount) {
    this.setState({
      loadedPlaylists: true,
      channelsCount: resultsCount,
    });
  }

  pageContent() {
    return [
      this.state.author ? (
        <ProfilePagesHeader key="ProfilePagesHeader" author={this.state.author} type="channels" />
      ) : null,
      this.state.author ? (
        <ProfilePagesContent key="ProfilePagesContent">
          <ApiUrlConsumer>
            {(apiUrl) => (
              <MediaListWrapper
                title={-1 < this.state.channelsCount ? 'Channels' : void 0}
                className="profile-channels-content items-list-ver"
              >
                <LazyLoadItemListAsync
                  requestUrl={apiUrl.user.channels + this.state.author.username}
                  itemsCountCallback={this.getChannelsCountFunc}
                  hideViews={true}
                  hideAuthor={true}
                  hideDate={!PageStore.get('config-media-item').displayPublishDate}
                />
              </MediaListWrapper>
            )}
          </ApiUrlConsumer>
        </ProfilePagesContent>
      ) : null,
    ];
  }
}
