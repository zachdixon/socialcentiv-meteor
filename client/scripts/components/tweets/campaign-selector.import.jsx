"use strict";

let {number, string, array, func, oneOfType} = React.PropTypes;

export let CampaignsSelector = React.createClass({
  displayName: "CampaignsSelector",

  propTypes: {
    conversation_id: number.isRequired,
    reply_campaign_id: oneOfType([number, string]),
    campaigns: array.isRequired,
    onChange: func.isRequired
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
            this.props.campaigns.map((campaign) => {
              let c_id = campaign.id;
              return (
                <div key={`campaign-radios-${c_id}`}>
                  <input
                    type="radio"
                    id={`campaign-radio-${conv_id}-${c_id}`}
                    name={`convo-radios-${conv_id}`}
                    value={c_id}
                    checked={this.props.reply_campaign_id == c_id}
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
            checked={this.props.reply_campaign_id == "none"}
            onChange={this.props.onChange}
          />
          <label htmlFor={`campaign-radio-none-${conv_id}`}>None</label>
        </div>
      </div>
    )
  }
});
