import React from 'react';
import { Switch, Route } from 'react-router';

import Main from './screens/Main';

export default (
  <Switch>
    <Route exact path="/" component={Main} />
  </Switch>
);
