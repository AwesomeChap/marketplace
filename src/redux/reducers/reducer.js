import { SAVE, REMOVE, LOADING, SAVE_ERRORS} from '../actions/actions';

const initialState = {
  loggedIn: false,
  user: null,
  loaded: null,
  errors: null
}

export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SAVE: return { loggedIn: action.payload.user != null, loaded: true, user: { ...action.payload.user } };
    case REMOVE: return { loggedIn: false, loaded: true, user: null };
    case LOADING: return { loaded: false };
    case SAVE_ERRORS: return { loaded: true, errors: action.payload.err }
    default: return state;
  }
}