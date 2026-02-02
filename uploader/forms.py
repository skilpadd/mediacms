from django import forms
from users.models import Channel
from files.widgets import ChannelModalWidget


class FineUploaderUploadForm(forms.Form):
    qqfile = forms.FileField()
    qquuid = forms.CharField()
    qqfilename = forms.CharField()
    qqpartindex = forms.IntegerField(required=False)
    qqchunksize = forms.IntegerField(required=False)
    qqtotalparts = forms.IntegerField(required=False)
    qqtotalfilesize = forms.IntegerField(required=False)
    qqpartbyteoffset = forms.IntegerField(required=False)
    channels = forms.CharField(required=False)


class FineUploaderUploadSuccessForm(forms.Form):
    qquuid = forms.CharField()
    qqfilename = forms.CharField()
    qqtotalparts = forms.IntegerField()
    qqtotalfilesize = forms.IntegerField(required=False)
    channels = forms.CharField(required=False)


class ChannelSelectForm(forms.Form):
    channels = forms.ModelMultipleChoiceField(
        queryset=Channel.objects.none(),
        widget=ChannelModalWidget(),
        required=False,
        label="Select Channels"
    )

    def __init__(self, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["channels"].queryset = Channel.objects.filter(user=user)
