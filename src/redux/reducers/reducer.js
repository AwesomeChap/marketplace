import {
  SAVE, REMOVE, LOADING, SAVE_ERRORS, SET_CONFIG, UPDATE_MAIL_CONFIG,
  UPDATE_CATEGORIES_CONFIG, SET_SELLER_CONFIG, SET_BRANCH_ID, SET_LOCATION
} from '../actions/actions';

const initialState = {
  loggedIn: false,
  user: null,
  loaded: null,
  config: null,
  sellerConfig: null,
  branchId: null,
  errors: null,
  location: null,
}

export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SAVE: return { ...state, loggedIn: action.payload.user != null, loaded: true, user: { ...action.payload.user } };
    case REMOVE: return { ...state, loggedIn: false, loaded: true, user: null };
    case LOADING: return { ...state, loaded: false };
    case SET_CONFIG: return { ...state, config: { ...action.payload.config } };
    case SET_BRANCH_ID: return { ...state, branchId: action.payload.branchId };
    case SET_SELLER_CONFIG: return { ...state, sellerConfig: { ...action.payload.sellerConfig } };
    case UPDATE_MAIL_CONFIG: let newConfig1 = { ...state.config }; newConfig1["mail"] = action.payload.mail; return { ...state, config: newConfig1 };
    case UPDATE_CATEGORIES_CONFIG: let newConfig2 = { ...state.config }; newConfig2["categories"] = action.payload.categories; return { ...state, config: newConfig2 };
    case SAVE_ERRORS: return { ...state, loaded: true, errors: action.payload.err };
    case SET_LOCATION: return { ...state, location: action.payload.location };
    default: return state;
  }
}