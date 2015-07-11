@Header = React.createClass
  mixins: [ReactMeteorData]

  getMeteorData: ->

  render: ->
    <div className="main-nav-wrapper">
      <div className="container">
        <div className="row">
          <a>
            <div className="logo col-md-2 col-sm-2 col-xs-2">
              <img alt="socialcentiv logo" className="logo-img" src="images/new-logo.png"/>
            </div>
          </a>
          <nav>
            <a className="main-nav-menu" href="#"><span className="glyphicon glyphicon-th"></span></a>
            <ul id="main-nav">
              <a className="close-mobile-menu" href="#"><span className="glyphicon glyphicon-remove"></span></a>
              <li className="main-nav-item">
                <a className="main-nav-link {{isActiveRoute 'tweets'}}" href="{{pathFor 'tweets'}}"><img className="smallimg main-nav-icon" src="images/Twitter_logo_white.png" /><span className="label">Tweets</span></a>
              </li>
              <li className="main-nav-item">
                <a className="main-nav-link {{isActiveRoute 'campaigns'}}" href="{{pathFor 'campaigns'}}"><span className="ss-bullseye main-nav-icon"></span><span className="label">Campaign</span></a>
              </li>
              <li className="main-nav-item" id="reports">
                <a className="main-nav-link {{isActiveRoute 'reports'}}" href="{{pathFor 'reports'}}"><span className="icon-pie main-nav-icon"></span><span className="label">Reports</span></a>
              </li>
              <li className="main-nav-item pull-right dropdown-nav">
                {{#with business}}
                  <a className="main-nav-link sub-nav-toggle" href="" style="padding: 30px 10px;">
                    {{#if $eq status 'active'}}
                      <span className="account-logo-wrapper">
                        <img className="account-logo" src="{{twitter_avatar_url}}">
                      </span>
                    {{/if}}
                    <span className="label" data-source="currentAccount.name">Nice Restaurant</span>
                  </a>
                {{/with}}
                <ul className="sub-nav" style="display: none;">
                  <li className="sub-nav-item">
                    <a className="sub-nav-link" href="/account">
                      <span className="glyphicon glyphicon-user main-nav-icon"></span>
                      <span className="label">My Account</span>
                    </a>
                  </li>
                  <li className="sub-nav-item">
                    <a className="sub-nav-link link-logout" href="">
                      <span className="glyphicon glyphicon-log-out main-nav-icon"></span>
                      <span className="label">Log Out</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>