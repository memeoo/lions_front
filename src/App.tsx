import React from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import AdminLogin from './screens/admin/login';
import AdminMain from './screens/admin/main';
import AddMember from './screens/admin/addMember';
import {NotFound} from './screens/notfound';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/admin" component={AdminLogin} />
        <Route path="/adminMain" component={AdminMain} />
        {/* <Route path="/addMember" component={AddMember} /> */}
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
  