import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/userSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persitedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
  reducer: persitedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
