"use strict";

import { AccountDetails } from 'client/scripts/components/tweets/account-details';
import { KeyphrasesWidget } from 'client/scripts/components/keyphrases/keyphrases-widget';
import { ConversationsList } from 'client/scripts/components/tweets/conversations';

export let TweetsPage = React.createClass({
  displayName: "TweetsPage",
  render() {
    return (
      <div className="conversations-index">
        <div id="left-col" className="hidden-xs clearfix">
          <AccountDetails />
          <KeyphrasesWidget />
        </div>
      </div>
    )
  }
});
