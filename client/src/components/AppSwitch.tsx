import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import MainPage from './main/MainPage';
import PropertiesPage from './properties/PropertiesPage';

const AppSwitch: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route path='/languages' component={PropertiesPage} />
      </Switch>
    </Router>
  );
};

export default AppSwitch;
