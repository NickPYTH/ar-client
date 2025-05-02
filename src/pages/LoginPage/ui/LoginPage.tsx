import {Button, Flex, Input, NotificationArgsProps, Space} from "antd";
import React, {useEffect, useState} from "react";
import {GetTokenResponseType, userAPI} from "service/UserService";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {Navigate} from "react-router-dom";

type NotificationPlacement = NotificationArgsProps['placement'];

const LoginPage = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----
    
    // States
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [accessToken] = useState<string | null>(localStorage.getItem('access'));
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // Web requests
    const [getTokens, {
        data: getTokensResponse,
        error: getTokensError,
    }] = userAPI.useCreateMutation();
    const [verifyTokenRequest, {
        isSuccess: verifyTokenIsSuccess,
    }] = userAPI.useVerifyMutation();
    // -----
    
    // Handlers
    const loginHandler = () => {
        if (!username || !password) {
            showInfoNotification('topRight', "Некоторые поля остались пустыми");
            return;
        }
        getTokens({username, password});
    }
    // -----

    // Effects
    useEffect(() => {
        if (accessToken) {
            verifyTokenRequest({token: accessToken});
        }
    }, []);
    useEffect(() => {
        if (verifyTokenIsSuccess) {
            setShouldRedirect(true);
        }
    }, [verifyTokenIsSuccess]);
    useEffect(() => {
        if (getTokensResponse) {
            if ('access' in getTokensResponse) {
                let response: GetTokenResponseType = getTokensResponse as GetTokenResponseType;
                if (response.access && response.refresh) {
                    showSuccessNotification('topRight', response.access ?? "");
                    localStorage.setItem('access', response.access);
                    localStorage.setItem('refresh', response.refresh);
                    setShouldRedirect(true);
                }
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

    if (shouldRedirect) return (<Navigate to="/article_list" />);
    return(
        <Flex justify={'center'} align={'center'} style={{height: window.innerHeight}}>
            <Space direction={'vertical'} align={'center'}>
                <Flex align={"center"}>
                    <div style={{width: 130}}>Пользователь</div>
                    <Input style={{width: 200}} value={username ?? ""} onChange={(e) => setUsername(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 130}}>Пароль</div>
                    <Input.Password style={{width: 200}} value={password ?? ""} onChange={(e) => setPassword(e.target.value)}/>
                </Flex>
                <Button onClick={loginHandler} type={'primary'} style={{width: 130}}>Войти</Button>
            </Space>
        </Flex>
    )
}

export default LoginPage;