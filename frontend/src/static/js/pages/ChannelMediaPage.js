import React from 'react';
import PropTypes from 'prop-types';
import { ApiUrlContext, LinksConsumer, MemberContext, SiteContext } from '../utils/contexts';
import { PageStore, ProfilePageStore } from '../utils/stores';
import { ProfilePageActions, PageActions } from '../utils/actions';
import { translateString } from '../utils/helpers';
import { MediaListWrapper } from '../components/MediaListWrapper';
import ProfilePagesHeader from '../components/profile-page/ProfilePagesHeader';
import ProfilePagesContent from '../components/profile-page/ProfilePagesContent';
import { LazyLoadItemListAsync } from '../components/item-list/LazyLoadItemListAsync';
import { BulkActionConfirmModal } from '../components/BulkActionConfirmModal';
import { BulkActionPermissionModal } from '../components/BulkActionPermissionModal';
import { BulkActionPlaylistModal } from '../components/BulkActionPlaylistModal';
import { BulkActionChangeOwnerModal } from '../components/BulkActionChangeOwnerModal';
import { BulkActionPublishStateModal } from '../components/BulkActionPublishStateModal';
import { BulkActionCategoryModal } from '../components/BulkActionCategoryModal';
import { BulkActionTagModal } from '../components/BulkActionTagModal';
import { ProfileMediaFilters } from '../components/search-filters/ProfileMediaFilters';
import { ProfileMediaTags } from '../components/search-filters/ProfileMediaTags';
import { ProfileMediaSorting } from '../components/search-filters/ProfileMediaSorting';

import { Page } from './_Page';

import '../components/profile-page/ProfilePage.scss';

export class ChannelMediaPage extends Page {
  constructor(props) {
    super(props, 'channel-media');

    
    const channelToken = window.MediaCMS?.channelToken || this.getChannelTokenFromUrl();

    this.state = {
      channelToken: channelToken,
      channelData: null,
      requestUrl: null,
      mediaCount: null,
      loading: true,
    };

    this.getCountFunc = this.getCountFunc.bind(this);
  }

  getChannelTokenFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
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

    return (
      <div className="profile-page-wrapper">
        <div className="profile-page-header">
          <span className="profile-banner-wrap">
            {channelData.banner_url ? (
              <span className="profile-banner" style={{ backgroundImage: `url(${channelData.banner_url})`}}></span>
            ) : null}
          </span>
        
        <div className="profile-info-nav-wrap">
          <div className="profile-info">
            <div className="profile-info-innner">
              <div>
                {channelData.thumbnail_url ? (
                  <img src={channelData.thumbnail_url} alt={channelData.title}/>
                ): null}
              </div>
              <div>
                <h1>{channelData.title}</h1>
                {channelData.description ? (
                  <p className="channel-description">{channelData.description}</p>
                ): null}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-page-content">
          <MediaListWrapper
            title={mediaCount !== null ? `Videos (${mediaCount})` : 'Videos'}
            className="items-list-ver"
          >
          <LazyLoadItemListAsync
            requestUrl={requestUrl}
            itemsCountCallback={this.getCountFunc}
            hideAuthor={false}
            hideViews={!PageStore.get('config-media-item').displayViews}
            hideDate={!PageStore.get('config-media-item').displayPublishDate}
            />
          </MediaListWrapper>
        </div>
        </div>
      </div>
    );
  }
}

ChannelMediaPage.PropTypes = {
  title: PropTypes.string,
};

ChannelMediaPage.defaultProps = {
  title: 'Channel',
};