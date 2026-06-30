import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePopup } from '../../utils/hooks/';
import { CircleIconButton, PopupMain } from '../_shared';
import { MemberContext, SiteContext } from '../../utils/contexts';
import ChannelPageStore from '../../utils/stores/ChannelPageStore';
import { translateString } from '../../utils/helpers';
import { ChannelPageActions } from '../../utils/actions/';
import { PageStore } from '../../utils/stores/';

function InlineTab(props) {
  return (
    <li className={props.isActive ? 'active' : null}>
      <a href={props.link} title={props.label}>
        {props.label}
      </a>
    </li>
  );
}

InlineTab.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

class NavMenuInlineTabs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayNext: false,
      displayPrev: false,
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);

    this.updateSlider = this.updateSlider.bind(this);
    this.updateSliderButtonsView = this.updateSliderButtonsView.bind(this);

    this.onToggleSearchField = this.onToggleSearchField.bind(this);

    PageStore.on('window_resize', this.updateSlider);

    this.sliderRecalTimeout = null;

    PageStore.on(
      'changed_page_sidebar_visibility',
      function () {
        clearTimeout(this.sliderRecalTimeout);

        // NOTE: 200ms is transition duration, set in CSS.
        this.sliderRecalTimeout = setTimeout(
          function () {
            this.updateSliderButtonsView();

            this.sliderRecalTimeout = setTimeout(
              function () {
                this.sliderRecalTimeout = null;

                this.updateSlider();
              }.bind(this),
              50
            );
          }.bind(this),
          150
        );
      }.bind(this)
    );

    this.previousBtn = (
      <span className="previous-slide">
        <CircleIconButton buttonShadow={false} onClick={this.prevSlide}>
          <i className="material-icons">keyboard_arrow_left</i>
        </CircleIconButton>
      </span>
    );
    this.nextBtn = (
      <span className="next-slide">
        <CircleIconButton buttonShadow={false} onClick={this.nextSlide}>
          <i className="material-icons">keyboard_arrow_right</i>
        </CircleIconButton>
      </span>
    );
  }

  componentDidMount() {
    this.updateSlider();
    if (this.refs.itemsListWrap) {
      this.refs.itemsListWrap.addEventListener('scroll', this.updateSliderButtonsView.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.refs.itemsListWrap) {
      this.refs.itemsListWrap.removeEventListener('scroll', this.updateSliderButtonsView.bind(this));
    }
  }

  nextSlide() {
    if (!this.refs.itemsListWrap) return;
    const scrollAmount = this.refs.itemsListWrap.offsetWidth * 0.7; // Scroll 70% of visible width
    this.refs.itemsListWrap.scrollLeft += scrollAmount;
    setTimeout(() => this.updateSliderButtonsView(), 50);
  }

  prevSlide() {
    if (!this.refs.itemsListWrap) return;
    const scrollAmount = this.refs.itemsListWrap.offsetWidth * 0.7; // Scroll 70% of visible width
    this.refs.itemsListWrap.scrollLeft -= scrollAmount;
    setTimeout(() => this.updateSliderButtonsView(), 50);
  }

  updateSlider(afterItemsUpdate) {
    this.updateSliderButtonsView();
  }

  updateSliderButtonsView() {
    if (!this.refs.itemsListWrap) return;

    const container = this.refs.itemsListWrap;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // Show prev arrow if we can scroll left
    const canScrollLeft = scrollLeft > 1;

    // Show next arrow if we can scroll right
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

    this.setState({
      displayPrev: canScrollLeft,
      displayNext: canScrollRight,
    });
  }

  onToggleSearchField() {
    setTimeout(() => this.updateSlider(), 100);
  }

  render() {
    return (
      <nav ref="tabsNav" className="profile-nav items-list-outer list-inline list-slider">
        <div className="profile-nav-inner items-list-outer">
          {this.state.displayPrev ? this.previousBtn : null}

          <ul className="items-list-wrap" ref="itemsListWrap">
            <InlineTab
              id="about"
              isActive={'about' === this.props.type}
              label={translateString('About')}
              link={this.props.channelUrl + '/about'}
            />
            <InlineTab
              id="media"
              isActive={'media' === this.props.type}
              label={translateString('Media')}
              link={this.props.channelUrl}
            />
          </ul>

          {this.state.displayNext ? this.nextBtn : null}
        </div>
      </nav>
    );
  }
}

NavMenuInlineTabs.propTypes = {
  type: PropTypes.oneOf(['media', 'about']).isRequired,
  channelUrl: PropTypes.string.isRequired,
  channel: PropTypes.object
};

export default function ChannelPagesHeader(props) {
  const [popupContentRef, PopupContent, PopupTrigger] = usePopup();

  const profilePageHeaderRef = useRef(null);
  const profileNavRef = useRef(null);

  const [fixedNav, setFixedNav] = useState(false);

  const positions = {
    profileNavTop: 0,
  };

  const userIsChannelOwner = !MemberContext._currentValue.is.anonymous && props.channel?.author_name === MemberContext._currentValue.username;
  const userCanDeleteChannel = userIsChannelOwner || MemberContext._currentValue.is.admin;
  const userCanEditChannel = userIsChannelOwner || MemberContext._currentValue.can.editChannel;
  
  function cancelChannelRemoval() {
    popupContentRef.current.toggle();
  }

  function proceedChannelRemoval() {
    ChannelPageActions.remove_channel(props.channel.friendly_token);
    popupContentRef.current.toggle();
  }

  function onChannelDelete() {
    setTimeout(function () {
      window.location.href = SiteContext._currentValue.url;
    }, 1000);
  }

  function onChannelDeleteFail() {
    alert('Failed to delete the channel');
  }

  function updateProfileNavTopPosition() {
    positions.profileHeaderTop = profilePageHeaderRef.current.offsetTop;
    positions.profileNavTop =
      positions.profileHeaderTop +
      profilePageHeaderRef.current.offsetHeight -
      profileNavRef.current.refs.tabsNav.offsetHeight;
  }

  function updateFixedNavPosition() {
    setFixedNav(positions.profileHeaderTop + window.scrollY > positions.profileNavTop);
  }

  function onWindowResize() {
    updateProfileNavTopPosition();
    updateFixedNavPosition();
  }

  function onWindowScroll() {
    updateFixedNavPosition();
  }

  useEffect(() => {
    if (userCanDeleteChannel) {
      ChannelPageStore.on('channel_delete', onChannelDelete);
      ChannelPageStore.on('channel_delete_fail', onChannelDeleteFail);
    }

    PageStore.on('resize', onWindowResize);
    PageStore.on('changed_page_sidebar_visibility', onWindowResize);
    PageStore.on('window_scroll', onWindowScroll);

    updateProfileNavTopPosition();
    updateFixedNavPosition();

    return () => {
      if (userCanDeleteChannel) {
        ChannelPageStore.removeListener('channel_delete', onChannelDelete);
        ChannelPageStore.removeListener('channel_delete_fail', onChannelDeleteFail);
      }

      PageStore.removeListener('resize', onWindowResize);
      PageStore.removeListener('changed_page_sidebar_visibility', onWindowResize);
      PageStore.removeListener('window_scroll', onWindowScroll);
    };
  }, []);

  return (
    <div ref={profilePageHeaderRef} className={'profile-page-header' + (fixedNav ? ' fixed-nav' : '')}>
      <span className="profile-banner-wrap">
        {props.channel.banner_url ? (
          <span
            className="profile-banner"
            style={{backgroundImage: `url(${props.channel.banner_url})`}}
          ></span>
        ) : null}
        {userCanDeleteChannel ? (
          <span className="delete-profile-wrap">
            <PopupTrigger contentRef={popupContentRef}>
              <button className="delete-profile" title="Remove channel">
                <i className="material-icons">delete</i>
              </button>
            </PopupTrigger>

            <PopupContent contentRef={popupContentRef}>
              <PopupMain>
                <div className="popup-message">
                  <span className="popup-message-title">Channel removal</span>
                  <span className="popup-message-main">You're willing to remove channel permanently?</span>
                </div>
                <hr />
                <span className="popup-message-bottom">
                  <button className="button-link cancel-profile-removal" onClick={cancelChannelRemoval}>
                    CANCEL
                  </button>
                  <button className="button-link proceed-profile-removal" onClick={proceedChannelRemoval}>
                    PROCEED
                  </button>
                </span>
              </PopupMain>
            </PopupContent>
          </span>
        ) : null}
        {userCanEditChannel ? (
          <a href={props.channelUrl + '/edit'} className="edit-channel-icon" title="Edit Channel">
            <i className="material-icons">edit</i>
          </a>
        ) : null}
      </span>

      <div className="profile-info-nav-wrap">
        {props.channel.thumbnail_url || props.channel.title ? (
          <div className="profile-info">
            <div className="profile-info-inner">
              <div>{props.channel.thumbnail_url ? <img src={props.channel.thumbnail_url} alt={props.channel.title} /> : null}</div>
              <div>
                {props.channel.title ? (
                  <div className="profile-name-edit-wrapper">
                    <h1>{props.channel.title}</h1>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <NavMenuInlineTabs
          ref={profileNavRef}
          type={props.type}
          channelUrl={props.channelUrl}
          channel={props.channel}
        />
      </div>
    </div>
  );
}

ChannelPagesHeader.propTypes = {
  channel: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnail_url: PropTypes.string,
    banner_url: PropTypes.string,
    friendly_token: PropTypes.string,
    user: PropTypes.object,
  }).isRequired,
  channelUrl: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['media', 'about']).isRequired,
};

ChannelPagesHeader.defaultProps = {
  type: 'media',
};
