"use strict";

import { ImageUploader } from 'client/scripts/components/images/image-uploader';

export let CampaignImages = React.createClass({
  displayName: "CampaignImages",
  mixins: [ReactMeteorData],

  getMeteorData() {
    let campaign_id = Session.get('activeConversationCampaignId'),
        availableImages = Images.find({campaign_id: campaign_id, selected: false},{$sort: {updated_at: "0"}}).fetch(),
        selectedImages = Images.find({campaign_id: campaign_id, selected: true}).fetch()
    return {
      campaign_id: campaign_id,
      availableImages: availableImages,
      selectedImages: selectedImages
    }
  },
  render() {
    return (
      <div>
        <SelectedImages images={this.data.selectedImages}/>
        <AvailableImages campaignId={this.data.campaign_id} images={this.data.availableImages}/>
      </div>
    )
  }
});

let SelectedImages = React.createClass({
  displayName: "SelectedImages",
  propTypes: {
    images: React.PropTypes.array.isRequired
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h2>
            Current Selected Images (4 maximum)
          </h2>
        </div>
        {(() => {
          if (this.props.images.length) {
            return (
              <div className="col-xs-12">
                {this.props.images.map((image) => {
                  return <CampaignImage key={image._id} imageId={image._id} />
                })}
              </div>
            )
          } else {
            return (
              <div className="col-xs-12">
                <div className="alert alert-info">
                  <p className="alert-text">
                    No images selected, choose some from below or upload more images
                  </p>
                </div>
              </div>
            )
          }
        })()}
      </div>
    )
  }
});

let AvailableImages = React.createClass({
  displayName: "AvailableImages",
  propTypes: {
    campaignId: React.PropTypes.number,
    images: React.PropTypes.array.isRequired
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h2>
            Available Images
          </h2>
        </div>
        <div className="col-xs-12">
          <ImageUploader campaignId={this.props.campaignId} />
          {this.props.images.map((image) => {
            return <CampaignImage key={image._id} imageId={image._id} deletable={true}/>
          })}
        </div>
      </div>
    )
  }
})

let CampaignImage = React.createClass({
  displayName: "CampaignImage",
  mixins: [ReactMeteorData],
  propTypes: {
    imageId: React.PropTypes.string.isRequired,
    deletable: React.PropTypes.bool
  },
  getMeteorData() {
    return {
      image: Images.findOne(this.props.imageId)
    }
  },
  handleToggleSelected(e) {
    let selected = this.data.image.selected;
    Images.update(this.props.imageId, {$set: {selected: !selected}});
  },
  handleDelete(e) {
    e.preventDefault();
    Images.remove(this.props.imageId);
  },
  render() {
    let image = this.data.image;
    if (image) {
      return (
        <div className="image-wrapper" htmlFor={`image-${image.id}`}>
          <label>
            <input className="select-image-checkbox"
                   id={`image-${image._id}`}
                   onChange={this.handleToggleSelected}
                   checked={image.selected}
                   type="checkbox" />
            <div className="campaign-image" style={{backgroundImage: `url(${image.url})`}}></div>
          </label>
          {this.props.deletable? (
            <a className="delete-image" onClick={this.handleDelete} href="">
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          ) : null}
        </div>
      )
    } else {
      return null;
    }
    
  }
})