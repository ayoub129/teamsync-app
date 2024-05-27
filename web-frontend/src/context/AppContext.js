import React, { createContext, useReducer } from 'react';
import appReducer from './AppReducer';


const initialState = {
    user: null,
    channels: [],
    groups: [],
    discussions: [],
    notifications: [],
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
  
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    );
  };
  