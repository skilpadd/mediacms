import React from 'react';
import { SiteConsumer } from '../utils/contexts/';
import { MediaPageStore } from '../utils/stores/';
import AttachmentViewer from '../components/media-viewer/AttachmentViewer';
// import AudioViewer from '../components/media-viewer/AudioViewer';
import ImageViewer from '../components/media-viewer/ImageViewer';
import PdfViewer from '../components/media-viewer/PdfViewer';
import VideoViewer from '../components/media-viewer/VideoViewer';
import { _VideoMediaPage } from './_VideoMediaPage';
import { formatInnerLink } from '../utils/helpers';
import {SiteContext} from '../utils/contexts/';

if (window.MediaCMS.site.devEnv) {
  const extractUrlParams = () => {
    const pathMatch = window.location.pathname.match(/\/playlist\/([\w_-]+)/);
    const playlistId = pathMatch ? pathMatch[1] : null;
    const mediaId = window.MediaCMS.mediaId || null;
    return { mediaId, playlistId };
  };

  const { mediaId, playlistId } = extractUrlParams();

  if (mediaId) {
    window.MediaCMS.mediaId = mediaId;
  }

  if (playlistId) {
    window.MediaCMS.playlistId = playlistId;
  }
}

export class MediaPage extends _VideoMediaPage {
  viewerContainerContent(mediaData) {
    switch (MediaPageStore.get('media-type')) {
      case 'video':
      case 'audio':
        return (
          <SiteConsumer>{(site) => <VideoViewer data={mediaData} siteUrl={site.url} inEmbed={!1} />}</SiteConsumer>
        );
      case 'image':
        return <ImageViewer />;
      case 'pdf':
        const pdf_url = formatInnerLink(MediaPageStore.get('media-original-url'), SiteContext._currentValue.url);
        return <PdfViewer fileUrl={pdf_url} />;
    }

    return <AttachmentViewer />;
  }
}
