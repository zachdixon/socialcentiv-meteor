"use strict";

import { CampaignImages } from 'client/scripts/components/images/campaign-images';

export let CampaignImagesModal = React.createClass({

  render() {
    return (
      <div className="modal fade" id="gallery-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header clearfix">
              <h1 className="modal-title pull-left">
                Select images to send with your reply
              </h1>
              <button aria-label="Close" className="close pull-right" data-dismiss="modal" type="button">
                <span aria-label="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <CampaignImages />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-large border-bottom border-primary" data-dismiss="modal" type="button">Done</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});