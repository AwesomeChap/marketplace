import React, { useEffect } from 'react';

const Home = (props) => {

  useEffect(() => {
    if (props.loggedIn) {
      // console.log(props.user);
      props.history.push(props.dashboardPath);
    }
  }, [props]);

  return (
    <div className="wrapper">
      <div className="container">
        Home Page
      </div>
    </div>
  )
}

export default Home;