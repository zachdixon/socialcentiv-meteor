"use strict";

import { MainLayout} from 'client/scripts/components/global/layouts';
import { HomePage } from 'client/scripts/components/home-page';

FlowRouter.route('/', {
  name: 'Home',
  action: (params, queryParams) => {
    ReactLayout.render(MainLayout, {content: <HomePage />});
  }
});