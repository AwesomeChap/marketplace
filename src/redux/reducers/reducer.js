import {
  SAVE, REMOVE, LOADING, SAVE_ERRORS, SET_CONFIG, UPDATE_MAIL_CONFIG, SET_FILTER_OPTIONS,
  UPDATE_CATEGORIES_CONFIG, SET_SELLER_CONFIG, SET_BRANCH_ID, SET_LOCATION
} from '../actions/actions';

const initialState = {
  loggedIn: false,
  user: null,
  _loading: false,
  config: null,
  sellerConfig: null, 
  branchId: null,
  errors: null,
  location: null,
  filterOptions: {
    time: undefined,
    foodType: "Both",
    categories: [],
    costForOne: null, 
    moreFilters: [],
    sortingOption: "Distance"
  }
}

export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SAVE: return { ...state, loggedIn: action.payload.user != null, user: { ...action.payload.user } };
    case REMOVE: return {
      ...state, loggedIn: false, user: null, config: null, sellerConfig: null, branchId: null, errors: null, filterOptions: {
        time: null,
        foodType: "Both",
        categories: [],
        costForOne: null,
        moreFilters: [],
        sortingOption: "Distance"
      }
    };
    case LOADING: return { ...state, _loading: action.payload.value };
    case SET_CONFIG: return { ...state, config: { ...action.payload.config } };
    case SET_BRANCH_ID: return { ...state, branchId: action.payload.branchId };
    case SET_SELLER_CONFIG: return { ...state, sellerConfig: { ...action.payload.sellerConfig } };
    case UPDATE_MAIL_CONFIG: let newConfig1 = { ...state.config }; newConfig1["mail"] = action.payload.mail; return { ...state, config: newConfig1 };
    case UPDATE_CATEGORIES_CONFIG: let newConfig2 = { ...state.config }; newConfig2["categories"] = action.payload.categories; return { ...state, config: newConfig2 };
    case SAVE_ERRORS: return { ...state, errors: action.payload.err };
    case SET_LOCATION: return { ...state, location: action.payload.location };
    case SET_FILTER_OPTIONS: return { ...state, filterOptions: action.payload.filterOptions };
    default: return state;
  }
}