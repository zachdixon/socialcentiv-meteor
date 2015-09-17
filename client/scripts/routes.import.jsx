"use strict";

// NOTE - Remember to update permissions in permit-utility for route permissions

import { LayoutManager } from 'client/scripts/components/global/layout-manager';
import { SessionsLayout, MainLayout, AccountsLayout} from 'client/scripts/components/global/layouts';
import { NotAuthorizedPage } from 'NotAuthorizedPage';
import { LoginPage } from 'LoginPage';
import { AccountsPage } from 'AccountsPage';
import { TweetsPage } from 'TweetsPage';

var sessions = FlowRouter.group({}),
    managed = FlowRouter.group({}),
    accounts = managed.group({
      prefix: '/accounts'
    });

FlowRouter.notFound = {
  action: () => {
    FlowRouter.go('managedAccounts');
  }
};

sessions.route('/not_authorized', {
  name: 'notAuthorized',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: SessionsLayout, content: <NotAuthorizedPage />});
  }
});

sessions.route('/login', {
  name: 'login',
  action: (params, queryParams) => {
    ReactLayout.render(LayoutManager, {layout: SessionsLayout, content: <LoginPage />});
  }
});

accounts.route('/', {
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
accounts.route('/:id/tweets', {
  name: 'accountTweets',
  action: (params, queryParams) => {
    // Needed for refreshing page or navigating directly to this route
    Session.set('business_id', parseInt(params.id));
    ReactLayout.render(LayoutManager, {
      layout: MainLayout,
      content: <TweetsPage />
    });
  }
});
