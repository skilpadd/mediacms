import React from 'react';
import PropTypes from 'prop-types';
import { SiteContext } from '../utils/contexts';
import ProfilePagesContent from '../components/profile-page/ProfilePagesContent';
import { MediaListRow } from '../components/MediaListRow';
import { ChannelMediaPage } from './ChannelMediaPage';
import ChannelPagesHeader from '../components/channel-page/ChannelPagesHeader';

export class ChannelAboutPage extends ChannelMediaPage {
  constructor(props) {
    super(props);
    this.pageSlug = 'channel-about';
  }

  pageContent() {
    const { loading, channelData } = this.state;
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
        type="about"
        channel={channelData}
        channelUrl={channelUrl}
      />,
      <ProfilePagesContent key="ProfilePagesContent">
        <div className="media-list-wrapper items-list-ver profile-about-content">
          <MediaListRow title="About">
            {channelData.description || "No description available"}
          </MediaListRow>
        </div>
      </ProfilePagesContent>
    ];
  }
}

ChannelAboutPage.propTypes = {
  title: PropTypes.string,
};

ChannelAboutPage.defaultProps = {
  title: 'About',
};
