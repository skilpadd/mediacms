import React from 'react';
import PropTypes from 'prop-types';
import { ApiUrlContext, SiteContext } from '../utils/contexts';
import { PageStore } from '../utils/stores';
import { MediaListWrapper } from '../components/MediaListWrapper';
import { LazyLoadItemListAsync } from '../components/item-list/LazyLoadItemListAsync';
import ChannelPagesHeader from '../components/channel-page/ChannelPagesHeader';
import ProfilePagesContent from '../components/profile-page/ProfilePagesContent';

import { Page } from './_Page';

import '../components/profile-page/ProfilePage.scss';

export class ChannelMediaPage extends Page {
  constructor(props) {
    super(props, 'channel-media');
    
    const channelToken = window.MediaCMS?.channelToken

    this.state = {
      channelToken: channelToken,
      channelData: null,
      requestUrl: null,
      mediaCount: null,
      loading: true,
    };

    this.getCountFunc = this.getCountFunc.bind(this);
  }

  componentDidMount() {
    if (this.state.channelToken) {
      fetch(ApiUrlContext._currentValue.channels + '/' + this.state.channelToken)
      .then(res => res.json())
      .then(data => {
        this.setState({
          channelData: data,
          requestUrl: ApiUrlContext._currentValue.media + '?channel=' + this.state.channelToken,
          loading: false,
        });
      })
      .catch(error => {
        console.error('Failed to load channel:', error);
        this.setState({ loading: false });
      })
    }
  }

  getCountFunc(count) {
    this.setState({ mediaCount: count });
  }

  pageContent() {
    const { loading, channelData, requestUrl, mediaCount } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!channelData) {
      return <div>Channel not found</div>;
    }

    const siteUrl = SiteContext._currentValue.url.replace(/\/+$/, '');
    const channelUrl = siteUrl + '/channel/' + this.state.channelToken;

    return [
      <ChannelPagesHeader
        key="ChannelPagesHeader"
        type="media"
        channel={channelData}
        channelUrl={channelUrl}
      />,
      <ProfilePagesContent key="ProfilePagesContent">
        <MediaListWrapper
          title={mediaCount !== null ? `Uploads (${mediaCount})` : "Uploads"}
          className="items-list-ver"
          showBulkActions={false}
        >
          <LazyLoadItemListAsync
            requestUrl={requestUrl}
            itemsCountCallback={this.getCountFunc}
            hideAuthor={false}
            hideViews={!PageStore.get('config-media-item').displayViews}
            hideDate={!PageStore.get('config-media-item').displayPublishDate}
          />
        </MediaListWrapper>
      </ProfilePagesContent>
    ];
  }
}

ChannelMediaPage.PropTypes = {
  title: PropTypes.string,
};

ChannelMediaPage.defaultProps = {
  title: 'Channel',
};