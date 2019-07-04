import {SAVE, REMOVE} from '../actions/actions';

const initialState = {
  loggedIn: false,
  user : null
}

export default function(state = initialState, action){
  const {type} = action;
  switch(type){
    case SAVE : return { loggedIn: true, user : {...action.payload.user} };
    case REMOVE : return { loggedIn: false, user : null};
    default : return state;
  }
}