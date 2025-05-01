import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom'
import React from "react";
import {Navbar} from "shared/component/Navbar";
import {Result} from "antd";
import {routeConfig} from "./routeConfig";
import {MainPage} from "pages/MainPage";


export const Router: React.FC = () => {

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                {Object.values(routeConfig).map(({element, path}) => (
                    <Route
                        key={path}
                        path={path}
                        element={element}
                    />
                ))}
                <Route
                    path=''
                    element={<MainPage/>}
                />
                <Route
                    path='*'
                    element={<Result
                        status="404"
                        title="404"
                        subTitle="Извините, страницы на которую вы перешли не существует."
                    />}
                />
            </Routes>
        </BrowserRouter>)
};