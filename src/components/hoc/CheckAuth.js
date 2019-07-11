import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { saveUser, setLoading, saveErrors } from '../../redux/actions/actions';
import { message } from 'antd';
import axios from 'axios';

const CheckAuth = Component => (props) => {

  console.log(props);

  useEffect(() => {
    if (!props.loggedIn) {

      props.setLoading();

      axios.get('/auth/user')
        .then(({ data: { user } }) => {
          props.saveUser(user);

          if (user != null) {
            return message.success("Logged in!");
          }
        })
        .catch(e => props.saveErrors(e.response.data));
    }
  }, [])

  return (
    <>
      {/* <div>Check auth</div> */}
      <Component {...props} />
      {/* {React.cloneElement(props.children, { ...props })} */}
    </>
  )
}

const mapsStatToProps = state => state;
const ComposedCheckAuth = compose(
  connect(mapsStatToProps, { saveUser, setLoading, saveErrors }),
  CheckAuth
)

export default ComposedCheckAuth;

// const mapsStatToProps = state => state;

// export default connect(mapsStatToProps, { saveUser, setLoading, saveErrors })(CheckAuth);
