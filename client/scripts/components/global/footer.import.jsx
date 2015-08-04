"use strict";

export let Footer = React.createClass({
  displayName: "Footer",
  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="col-md-8">
            <div className="copyright">
              <p>&copy; 2015 SocialCentiv</p>
            </div>
            <div className="company-address">
              <p>703 McKinney Ave. Suite 433, Dallas, TX 75202</p>
            </div>
            <div className="terms-policy">
              <a href="http://socialcentiv.com/terms-of-use/">Terms</a><span>&nbsp;and&nbsp;</span><a href="http://socialcentiv.com/privacy-policy-2/">Privacy Policy</a>
            </div>
          </div>
          <div className="col-md-4 hiplogiq-app">
            <span>Powered By</span>
            <a href="http://www.socialcentiv.com">
              <img alt="SocialCentiv logo" src="images/new-logo-white.png" />
            </a>
          </div>
        </div>
      </div>
    )
  }
});