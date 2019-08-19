export const SAVE = "save user to store"
export const REMOVE = "remove user from store";
export const LOADING = "loading...";
export const SAVE_ERRORS = "save found errors";
export const SET_CONFIG = "set config";
export const SET_SELLER_CONFIG = "set seller config";
export const UPDATE_MAIL_CONFIG = "update mail config";
export const UPDATE_CATEGORIES_CONFIG = "update categories config";
export const SET_BRANCH_ID = "set branch id";
export const SET_LOCATION = "set location";

export const saveUser = (user) => ({
  type: SAVE,
  payload: { user }
})

export const removeUser = () => ({
  type: REMOVE
})

export const _setLoading = (value) => ({
  type: LOADING,
  payload: {value}
})

export const setConfig = (config) => ({
  type: SET_CONFIG,
  payload: { config }
})

export const updateMailConfig = (mail) => ({
  type: UPDATE_MAIL_CONFIG,
  payload: { mail }
})

export const updateCategoriesConfig = (categories) => ({
  type: UPDATE_CATEGORIES_CONFIG,
  payload: { categories }
})

export const setSellerConfig = (sellerConfig) => ({
  type: SET_SELLER_CONFIG,
  payload: { sellerConfig }
})

export const setBranchId = (branchId) => ({
  type: SET_BRANCH_ID,
  payload: { branchId }
})

export const setLocation = (location) => ({
  type: SET_LOCATION,
  payload: { location }
})

export const saveErrors = (err) => ({
  type: SAVE_ERRORS,
  payload: { err }
})