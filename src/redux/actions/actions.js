export const SAVE = "save user to store"
export const REMOVE = "remove user from store";

export const saveUser = (user) => ({
  type: SAVE,
  payload: { user }
})

export const removeUser = () => ({
  type: REMOVE
})