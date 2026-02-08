import json

from django import forms
from django.utils.safestring import mark_safe
from users.models import Channel


class CategoryModalWidget(forms.SelectMultiple):
    """Two-panel category selector with modal"""

    class Media:
        css = {'all': ('css/category_modal.css',)}
        js = ('js/category_modal.js',)

    def render(self, name, value, attrs=None, renderer=None):
        # Get all categories as JSON
        categories = []
        for opt_value, opt_label in self.choices:
            if opt_value:  # Skip empty choice
                categories.append({'id': str(opt_value), 'title': str(opt_label)})

        all_categories_json = json.dumps(categories)
        selected_ids_json = json.dumps([str(v) for v in (value or [])])

        html = f'''<div class="category-widget" data-name="{name}">
  <div class="category-content">
    <div class="category-panel">
      <input type="text" class="category-search" placeholder="Search categories...">
      <div class="category-list scrollable" data-panel="left"></div>
    </div>
    <div class="category-panel">
      <h3>Selected Categories</h3>
      <div class="category-list scrollable" data-panel="right"></div>
    </div>
  </div>
  <div class="hidden-inputs"></div>
  <script type="application/json" class="category-data">{{"all":{all_categories_json},"selected":{selected_ids_json}}}</script>
</div>'''

        return mark_safe(html)


class ChannelModalWidget(forms.SelectMultiple):
    """Two-panel channel selector with modal"""

    class Media:
        css = {'all': ('css/channel_modal.css',)}
        js = ('js/channel_modal.js',)

    def render(self, name, value, attrs=None, renderer=None):
        # Get all channels as JSON
        channels = []

        channel_ids = [str(opt_value) for opt_value, _ in self.choices if opt_value]
        channel_objs = {str(channel.pk): channel for channel in Channel.objects.filter(pk__in=channel_ids)}

        for opt_value, opt_label in self.choices:
            if opt_value:  # Skip empty choice
                thumbnail = ''
                title = str(opt_label)
                try:
                    channel = channel_objs.get(str(opt_value))
                    if channel:
                        thumbnail = channel.thumbnail_url()
                        title = channel.title
                except Channel.DoesNotExist:
                    pass

                channels.append({'id': str(opt_value), 'title': title, 'thumbnail': thumbnail})

        all_channels_json = json.dumps(channels)
        selected_ids_json = json.dumps([str(v) for v in (value or [])])

        html = f'''
          <div class="channel-widget" data-name="{name}">
            <div class="channel-content">
              <div class="channel-panel">
                <input type="text" class="channel-search" placeholder="Search channels...">
                <div class="channel-list scrollable" data-panel="left"></div>
              </div>
              <div class="channel-panel">
                <h3>Selected Channels</h3>
                <div class="channel-list scrollable" data-panel="right"></div>
              </div>
            </div>
            <div class="hidden-inputs"></div>
            <script type="application/json" class="channel-data">{{"all":{all_channels_json},"selected":{selected_ids_json}}}</script>
          </div>
        '''

        return mark_safe(html)
