import {RouteProps} from "react-router-dom";
import React from "react";
import UserPage from "pages/UserPage/ui/UserPage";
import {MainPage} from "pages/MainPage";

export enum AppRoutes {
    MAIN = 'MAIN',
    USER = 'USER',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.MAIN]: '/main',
    [AppRoutes.USER]: '/user',
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.USER]: {
        path: RoutePath.USER,
        element: <UserPage/>
    },
    [AppRoutes.MAIN]: {
        path: RoutePath.MAIN,
        element: <MainPage/>
    },
}