"use strict";

let {number, string, array, func, oneOfType} = React.PropTypes;

export let CampaignsSelector = React.createClass({
  displayName: "CampaignsSelector",
  mixins: [ReactMeteorData],

  propTypes: {
    conversation_id: number.isRequired,
    reply_campaign_id: oneOfType([number, string]),
    keyphrase_ids: array.isRequired,
    onChange: func.isRequired
  },

  getMeteorData() {
    let keyphrases = Keyphrases.find({id: {$in: this.props.keyphrase_ids}}).fetch(),
        campaign_ids = keyphrases.map((kp) => { return kp.campaign_id;}),
        campaigns = Campaigns.find({id: {$in: campaign_ids}, status: 'active'}, {sort: {default: 1}}).fetch();

    return {
      campaigns: campaigns
    }
  },

  getReplyCampaignId() {
    return this.props.reply_campaign_id || this.data.campaigns? this.data.campaigns[0].id : null || "none";
  },

  render() {
    let conv_id = this.props.conversation_id;

    return (
      <div className="campaign-selector clearfix">
        <h4>
          Select an applicable campaign
        </h4>
        <div className="radio-buttons">
          {
            this.data.campaigns.map((campaign) => {
              let c_id = campaign.id;
              return (
                <div key={`campaign-radios-${c_id}`}>
                  <input
                    type="radio"
                    id={`campaign-radio-${conv_id}-${c_id}`}
                    name={`convo-radios-${conv_id}`}
                    value={c_id}
                    checked={this.getReplyCampaignId() == c_id}
                    onChange={this.props.onChange}
                  />
                  <label htmlFor={`campaign-radio-${conv_id}-${c_id}`}>{campaign.name}</label>
                </div>
              )
            })
          }
          <input
            type="radio"
            id={`campaign-radio-none-${conv_id}`}
            name={`convo-radios-${conv_id}`}
            value="none"
            checked={this.getReplyCampaignId() == "none"}
            onChange={this.props.onChange}
          />
          <label htmlFor={`campaign-radio-none-${conv_id}`}>None</label>
        </div>
      </div>
    )
  }
});
