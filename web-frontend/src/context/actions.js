  export const setUser = (dispatch, user) => {
    dispatch({ type: 'SET_USER', payload: user });
  };
  
  export const setChannels = (dispatch, channels) => {
    dispatch({ type: 'SET_CHANNELS', payload: channels });
  };
  
  export const setGroups = (dispatch, groups) => {
    dispatch({ type: 'SET_GROUPS', payload: groups });
  };
  
  export const setDiscussions = (dispatch, discussions) => {
    dispatch({ type: 'SET_DISCUSSIONS', payload: discussions });
  };
  
  export const setNotifications = (dispatch, notifications) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };