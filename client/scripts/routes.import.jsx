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
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <AccountsPage />
    });
  }
});

// FIXME - load correct business based on id
managedAccounts.route('/:business_id/tweets', {
  name: 'accountTweets',
  action: (params, queryParams) => {
    Session.set('business_id', parseInt(params.business_id));
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <TweetsPage />
    });
  }
});
