"use strict";

import { SessionsLayout, MainLayout} from 'client/scripts/components/layouts';
import { LoginPage } from 'client/scripts/components/sessions/login-page';
import { TweetsPage } from 'TweetsPage';

debugger

FlowRouter.route('/', {
  name: 'tweets',
  action: (params, queryParams) => {
    ReactLayout.render(MainLayout, {content: <TweetsPage />});
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action: (params, queryParams) => {
    ReactLayout.render(SessionsLayout, {content: <LoginPage />});
  }
});
