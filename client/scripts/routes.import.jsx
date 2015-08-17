"use strict";

import { LayoutManager } from 'client/scripts/components/global/layout-manager';
import { SessionsLayout, MainLayout, AccountsLayout} from 'client/scripts/components/global/layouts';
import { LoginPage } from 'client/scripts/components/sessions/login-page';
import { AccountsPage } from 'client/scripts/components/accounts/accounts-page';
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
