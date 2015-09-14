"use strict";

// NOTE - Remember to update permissions in permit-utility for route permissions

import { LayoutManager } from 'client/scripts/components/global/layout-manager';
import { SessionsLayout, MainLayout, AccountsLayout} from 'client/scripts/components/global/layouts';
import { LoginPage } from 'LoginPage';
import { AccountsPage } from 'AccountsPage';
import { TweetsPage } from 'TweetsPage';

var main = FlowRouter.group({}),
    basic = FlowRouter.group({}),
    managed = FlowRouter.group({
      prefix: '/managed'
    }),
    managedAccounts = managed.group({
      prefix: '/accounts'
    });

main.route('/login', {
  name: 'login',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: SessionsLayout, content: <LoginPage />});
  }
});

basic.route('/', {
  name: 'tweets',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: MainLayout, content: <TweetsPage />});
  }
});

managedAccounts.route('/', {
  name: 'managedAccounts',
  triggersEnter: [() => {
      App.clearCurrentUserCookies();
      Session.set('business_id', undefined);
      Session.set('business', undefined);
      Conversations._remove({});
    }
  ],
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <AccountsPage />
    });
  }
});
managedAccounts.route('/:business_id/tweets', {
  name: 'accountTweets',
  action: (params, queryParams) => {
    // Needed for refreshing page or navigating directly to this route
    Session.set('business_id', parseInt(params.business_id));
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <TweetsPage />
    });
  }
});
