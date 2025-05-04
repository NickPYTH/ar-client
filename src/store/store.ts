import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userAPI} from "service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {articleAPI} from "service/ArticleService";
import {courseAPI} from "service/CourseService";

export type RootStateType = {
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    [userAPI.reducerPath]: userAPI.reducer,
    [articleAPI.reducerPath]: articleAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(userAPI.middleware)
                .concat(articleAPI.middleware)
                .concat(courseAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
