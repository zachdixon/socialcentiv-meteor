"use strict";

export let ImageUploader = React.createClass({
  displayName: "ImageUploader",
  propTypes: {
    campaignId: React.PropTypes.number
  },

  handleUpload(e) {
    let campaign_id, f, files, reader;
    files = e.target.files;
    campaign_id = this.props.campaignId;
    f = files[0];
    if (f.type.match("image.*")) {
      reader = new FileReader();
      reader.onload = ((theFile) => {
        return function(e) {
          return Images.insert({
            campaign_id: campaign_id,
            url: e.target.result,
            selected: false
          }, function(err, image) {
            if (err) {
              console.error(err);
              // return Messenger().post({
              //   type: 'error',
              //   id: 'imageUploadError',
              //   message: "There was a problem uploading that image",
              //   hideAfter: 5,
              //   singleton: true,
              //   showCloseButton: true
              // });
            }
          });
        };
      })(f);
      return reader.readAsDataURL(f);
    }
  },

  render() {
    return (
      <div className="image-wrapper upload-image-wrapper btn btn-primary">
        <label className="pull-right" htmlFor="upload-campaign-img">
          <p className="glyphicon glyphicon-upload"></p>
          <p>Upload Images</p>
          <input accept="image/*" onChange={this.handleUpload} id="upload-campaign-img" type="file" />
        </label>
      </div>
    )
  }
});