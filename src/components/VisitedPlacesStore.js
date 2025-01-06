import React, { createContext, useReducer, useContext } from "react";

const ADD_PLACE = "ADD_PLACE";

const initialState = {
  visitedPlacesList: [],
};

const visitedPlacesReducer = (state, action) => {
  switch (action.type) {
    case ADD_PLACE:
      return {
        ...state,
        visitedPlacesList: [...state.visitedPlacesList, action.payload],
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const VisitedPlacesContext = createContext();

export const VisitedPlacesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visitedPlacesReducer, initialState);

  return (
    <VisitedPlacesContext.Provider value={{ state, dispatch }}>
      {children}
    </VisitedPlacesContext.Provider>
  );
};

export const useVisitedPlaces = () => useContext(VisitedPlacesContext);
