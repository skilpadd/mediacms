import React from 'react';
import PropTypes from 'prop-types';
import { ApiUrlContext, LinksConsumer, MemberContext } from '../utils/contexts';
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

    const pathParts = window.location.pathname.split('/');
    const channelToken = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    console.log(`Channel Token: ${channelToken}`);

    this.state = {
      channelToken: channelToken,
      requestUrl: null,
      title: 'Channel Media',
      mediaCount: null,
    };

    this.getCountFunc = this.getCountFunc.bind(this);
  }

  componentDidMount() {
    if (this.state.channelToken) {
      const requestUrl = ApiUrlContext._currentValue.media + '?channel=' + this.state.channelToken;
      this.setState({ requestUrl });
    }
  }

  getCountFunc(count) {
    this.setState({ mediaCount: count });
  }

  pageContent() {
    if (!this.state.requestUrl) {
      return <div>Loading...</div>;
    }

    const titleWithCount = this.state.mediaCount !== null
    ? `${this.state.title} (${this.state.mediaCount})`
    : this.state.title;

    return (
      <div className="profile-page-content">
        <MediaListWrapper
          title={titleWithCount}
          className="items-list-ver"
        >
          <LazyLoadItemListAsync
            requestUrl={this.state.requestUrl}
            itemsCountCallback={this.getCountFunc}
            hideAuthor={false}
            hideViews={!PageStore.get('config-media-item').displayViews}
            hideDate={!PageStore.get('config-media-item').displayPublishDate}
            />
        </MediaListWrapper>
      </div>
    );
  }
}

ChannelMediaPage.PropTypes = {
  title: PropTypes.string,
};

ChannelMediaPage.defaultProps = {
  title: 'Channel Media',
};