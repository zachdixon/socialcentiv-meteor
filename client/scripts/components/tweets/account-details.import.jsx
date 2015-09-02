"use strict";

export let AccountDetails = React.createClass({
  displayName: "AccountDetails",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      business: Businesses.findOne(Session.get('business')._id)
    }
  },

  render() {
    let business = this.data.business;

    return (
      <div id="accountdetails">
        <div id="account-logo">
          <img src={business? business.twitter_avatar_url? business.twitter_avatar_url.replace("_normal","") : "" : ""} />
        </div>
        <div className="clearfix" id="account-details">
          <div id="account-name">{business? business.name : ""}</div>
          <div id="account-twitter-name">@{business? business.twitter_screen_name : ""}</div>
          <div id="twitter-account-change">
            <a
              className="authorize-twitter-link small-link" 
              href={`http://api.hiplocalhost.com:3000/start_twitter_process?business_id=${business? business.id : ""}&amp;return_to_url=http://my.hiplocalhost.com:3001/twitter_authorized`}>
              Change Twitter Account
            </a>
          </div>
        </div>
        <hr />
      </div>
    )
  }
});
