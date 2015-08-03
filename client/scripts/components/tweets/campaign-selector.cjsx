
{number, string, array, func, oneOfType} = React.PropTypes

CampaignsSelector = React.createClass
  mixins: [ReactMeteorData]

  propTypes:
    conversation_id: number.isRequired
    reply_campaign_id: oneOfType([number, string])
    keyphrase_ids: array.isRequired
    onChange: func.isRequired

  getMeteorData: ->
    keyphrases = Keyphrases.find({id: {$in: @props.keyphrase_ids}}).fetch()
    campaign_ids = keyphrases.map (kp) -> kp.campaign_id
    campaigns = Campaigns.find({id: {$in: campaign_ids}, status: 'active'}, {sort: {default: 1}}).fetch()

    campaigns: campaigns

  getReplyCampaignId: ->
    @props.reply_campaign_id or @data.campaigns?[0].id or "none"

  render: ->
    conv_id = @props.conversation_id

    <div className="campaign-selector clearfix">
      <h4>
        Select an applicable campaign
      </h4>
      <div className="radio-buttons">
        {
          @data.campaigns.map (campaign) =>
            c_id = campaign.id
            <div key={"campaign-radios-#{c_id}"}>
              <input
                type="radio"
                id={"campaign-radio-#{conv_id}-#{c_id}"}
                name={"convo-radios-#{conv_id}"}
                value={c_id}
                checked={@getReplyCampaignId() is c_id}
                onChange={@props.onChange}
              />
              <label htmlFor={"campaign-radio-#{conv_id}-#{c_id}"}>{campaign.name}</label>
            </div>
        }
        <input
          type="radio"
          id={"campaign-radio-none-#{conv_id}"}
          name={"convo-radios-#{conv_id}"}
          value="none"
          checked={@getReplyCampaignId() is "none"}
          onChange={@props.onChange}
        />
        <label htmlFor={"campaign-radio-none-#{conv_id}"}>None</label>
      </div>
    </div>

_.extend App.Components, {CampaignsSelector}