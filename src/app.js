import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import store from './redux/store';
import { Provider } from 'react-redux';

const App = (props) => {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Home}></Route>
      </Router>
    </Provider>
  )
}

export default App;