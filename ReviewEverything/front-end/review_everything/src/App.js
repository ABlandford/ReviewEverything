import React from 'react';
import Login from './login';
import Edit from './edit';
import Home from './home';
import SignUp from './signup';
import Del from './delete';
import UReview from './uReview';
import ReviewEdit from './review_edit'
import Forgot from './forgot'
import { BrowserRouter as Router, Switch, Route,  } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
 
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login/>
        </Route>
        <Route path='/home'>
          <Home/>
        </Route>
        <Route path='/signup'>
          <SignUp/>
        </Route>
        <Route path='/edit'>
          <Edit/>
        </Route>
        <Route path='/delUsers'>
          <Del/>
        </Route>
        <Route path='/userReviews'>
          <UReview/>
        </Route>
        <Route path='/editReview'>
          <ReviewEdit/>
        <Route path='/forgot'>
          <Forgot/>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;