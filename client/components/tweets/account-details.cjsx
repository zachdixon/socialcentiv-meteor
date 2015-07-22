

AccountDetails = React.createClass

  mixins: [ReactMeteorData]

  getMeteorData: ->
    business: Session.get('business')


  render: ->
    <div id="accountdetails">
      <div id="account-logo">
        <img src="{{twitter_avatar_large}}">
      </div>
      <div class="clearfix" id="account-details">
        <div id="account-name">{{name}}</div>
        <div id="account-twitter-name">@{{twitter_screen_name}}</div>
        <div id="twitter-account-change">
          <a class="authorize-twitter-link small-link" href="http://api.hiplocalhost.com:3000/start_twitter_process?business_id=2&amp;return_to_url=http://my.hiplocalhost.com:3001/twitter_authorized">Change Twitter Account</a>
        </div>
      </div>
      <hr />
    </div>