import {GetTokenResponseType, userAPI} from "service/UserService";
import React, {useEffect} from "react";
import {Button, NotificationArgsProps} from "antd";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";

type NotificationPlacement = NotificationArgsProps['placement'];
export const Navbar = () => {

    // States
    const api = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // Web requests
    const [getTokens, {
        data: getTokensResponse,
        error: getTokensError,
    }] = userAPI.useCreateMutation();
    // -----

    // Effects
    useEffect(() => {
        getTokens({
            username: "nick",
            password: "27062000"
        })
    }, []);
    useEffect(() => {
        if (getTokensResponse) {
            console.log(getTokensResponse)
            if ('access' in getTokensResponse) {
                let response: GetTokenResponseType = getTokensResponse as GetTokenResponseType;
                showSuccessNotification('topRight', response.access ?? "");
            }
        }
    }, [getTokensResponse]);
    useEffect(() => {
        if (getTokensError)
            if ('data' in getTokensError) {
                let response: GetTokenResponseType = getTokensError.data as GetTokenResponseType;
                showErrorNotification('topRight', response.detail ?? "");
            }
    }, [getTokensError]);
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        api?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        api?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        api?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    return (
        <div>
            <Button onClick={() => showInfoNotification('topRight', 'kek')}>kek</Button>
            Navbar
        </div>
    )
}