import React from 'react';
import { ApiUrlConsumer } from '../utils/contexts';
import { MediaListWrapper } from '../components/MediaListWrapper';
import { LazyLoadItemListAsync } from '../components/item-list/LazyLoadItemListAsync.jsx';
import { Page } from './Page';

interface ChannelsPageProps {
  id?: string;
  title?: string;
}

export const ChannelsPage: React.FC<ChannelsPageProps> = ({ id = 'channels', title = 'Channels' }) => (
  <Page id={id}>
    <ApiUrlConsumer>
      {(apiUrl) => (
        <MediaListWrapper title={title} className="items-list-ver">
          <LazyLoadItemListAsync 
          hideViews={true}
          requestUrl={apiUrl.channels} 
          />
        </MediaListWrapper>
      )}
    </ApiUrlConsumer>
  </Page>
);
