import React, {FC, useEffect, useMemo} from "react";
import {notification} from "antd";
import {useDispatch} from "react-redux";
import {setNotificationContextApi} from "store/slice/UserSlice";

const Context = React.createContext({ name: 'Notification context' });

const NotificationProvider: FC = ({children}) => {
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (api) dispatch(setNotificationContextApi(api));
    }, [api]);
    const contextValue = useMemo(() => ({ name: 'some value...' }), []);
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}
            {children}
        </Context.Provider>
    )
}

export default NotificationProvider;