const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_CHANNELS':
      return {
        ...state,
        channels: action.payload,
      };
    case 'SET_GROUPS':
      return {
        ...state,
        groups: action.payload,
      };
    case 'SET_DISCUSSIONS':
      return {
        ...state,
        discussions: action.payload,
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
};

export default appReducer;
