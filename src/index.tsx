import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {ReduxProvider} from "app/providers/ReduxProvider";
import {AntdProvider} from "app/providers/AntdProvider";
import {Router} from "component/Router";
import {NotificationProvider} from "app/providers/NotificationProvider";
import {DragAndDropProvider} from "app/providers/DragAndDropProvider";

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider>
            <AntdProvider>
                <NotificationProvider>
                    <DragAndDropProvider>
                        <Router/>
                    </DragAndDropProvider>
                </NotificationProvider>
            </AntdProvider>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
);