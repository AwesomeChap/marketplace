export const SAVE = "save user to store"
export const REMOVE = "remove user from store";
export const LOADING = "loading...";
export const SAVE_ERRORS = "save found errors";

export const saveUser = (user) => ({
  type: SAVE,
  payload: { user }
})

export const removeUser = () => ({
  type: REMOVE
})

export const setLoading = () => ({
  type: LOADING
})

export const saveErrors = (err) => ({
  type: SAVE_ERRORS,
  payload : { err }
})