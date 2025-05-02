import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userAPI} from "service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {articleAPI} from "service/ArticleService";

export type RootStateType = {
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    [userAPI.reducerPath]: userAPI.reducer,
    [articleAPI.reducerPath]: articleAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(userAPI.middleware)
                .concat(articleAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
