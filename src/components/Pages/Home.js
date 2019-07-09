import React, {useEffect} from 'react';

const Home = (props) => {
  
  useEffect(()=>{
    // props.history.push('/me/dashboard');
  },[]);

  return (
    <div className="wrapper">
      <div className="container">
        Home Page
      </div>
    </div>
  )
}

export default Home;