import React from 'react';
import PropTypes from 'prop-types';
import { SiteContext } from '../utils/contexts';
import ProfilePagesContent from '../components/profile-page/ProfilePagesContent';
import { MediaListRow } from '../components/MediaListRow';
import { ChannelMediaPage } from './ChannelMediaPage';
import ChannelPagesHeader from '../components/channel-page/ChannelPagesHeader';
import { translateString } from '../utils/helpers';

function MetaField(props) {
  return (
    <div className={props.id ? 'media-content-' + props.id : null}>
      <div className="media-content-field">
        <div className="media-content-field-label">
          <h4>{props.title}</h4>
        </div>
        <div className="media-content-field-content">{props.value}</div>
      </div>
    </div>
  );
}

function metaLinks(arr) {
  if (!arr | !arr.length) return [];
  const sep = arr.length > 1 ? ', ' : '';
  return arr.map((item, i) => (
    <div key={i}>
      <a href={item.url} title={item.title}>{item.title}</a>
      {i < arr.length - 1 ? sep : ''}
    </div>
  ));
}

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

    const tags = metaLinks(channelData.tags_info);
    const categories = metaLinks(channelData.categories_info);

    return [
      <ChannelPagesHeader
        key="ChannelPagesHeader"
        type="about"
        channel={channelData}
        channelUrl={channelUrl}
      />,
      <ProfilePagesContent key="ProfilePagesContent">
        <div className="media-list-wrapper items-list-ver profile-about-content">
          <MediaListRow title={translateString("About")}>
            <div style={{ marginBottom: '24px'}}>
              {channelData.description || translateString("No description available")}
            </div>

            {tags.length ? (
              <MetaField
                value={tags}
                title={tags.length > 1 ? translateString("Tags") : translateString("Tag")}
                id="tags"
              />
            ): null}

            {categories.length ? (
              <MetaField
                value={categories}
                title={categories.length > 1 ? translateString("Categories") : translateString("Category")}
                id="categories"
              />
            ) : null}
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
