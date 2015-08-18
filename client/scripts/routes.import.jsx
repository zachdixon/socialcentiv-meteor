"use strict";

// NOTE - Remember to update permissions in permit-utility for route permissions

import { LayoutManager } from 'client/scripts/components/global/layout-manager';
import { SessionsLayout, MainLayout, AccountsLayout} from 'client/scripts/components/global/layouts';
import { LoginPage } from 'LoginPage';
import { AccountsPage } from 'AccountsPage';
import { TweetsPage } from 'TweetsPage';

FlowRouter.route('/', {
  name: 'tweets',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: MainLayout, content: <TweetsPage />});
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: SessionsLayout, content: <LoginPage />});
  }
});

FlowRouter.route('/managed/accounts', {
  name: 'managedAccounts',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <AccountsPage />
    });
  }
});

// FIXME - load correct business based on id
FlowRouter.route('/managed/accounts/:business_id/tweets', {
  name: 'accountTweets',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <TweetsPage />
    });
  }
});
