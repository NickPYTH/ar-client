import {userAPI} from "service/UserService";
import React, {useEffect, useState} from "react";
import {Menu, MenuProps, NotificationArgsProps} from "antd";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Курсы',
        key: 'course_list',
    },
]

type NotificationPlacement = NotificationArgsProps['placement'];
export const Navbar = () => {

    // States
    let location = useLocation();
    let navigate = useNavigate();
    const api = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh'));
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [currentMenuItem, setCurrentMenuItem] = useState('course_list');
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

    // Web requests
    const [verifyTokenRequest, {
        isError: verifyTokenIsError,
    }] = userAPI.useVerifyMutation();
    const [refreshTokenRequest, {
        data: refreshTokenData,
        isSuccess: refreshTokenIsSuccess,
        isError: refreshTokenIsError,
    }] = userAPI.useRefreshMutation();
    // -----

    // Effects
    useEffect(() => {
        if (accessToken && refreshToken) {
            verifyTokenRequest({token: accessToken});
        } else {
            localStorage.clear();
            if (location.pathname.indexOf('login') == -1)
                setShouldRedirect(true);
        }
    }, []);
    useEffect(() => {
        if (verifyTokenIsError && refreshToken) {
            refreshTokenRequest({'refresh': refreshToken})
        }
    }, [verifyTokenIsError]);
    useEffect(() => {
        if (refreshTokenIsSuccess && refreshTokenData) {
            let accessToken = refreshTokenData.access;
            if (accessToken) {
                localStorage.setItem('access', accessToken);
                showInfoNotification('topRight', 'Токен обновлен')
            }
        }
    }, [refreshTokenIsSuccess]);
    useEffect(() => {
        if (refreshTokenIsError) {
            localStorage.clear();
            setShouldRedirect(true);
        }
    }, [refreshTokenIsError])
    // -----

    // Handlers
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key == 'course_list') navigate('/course_list')
        setCurrentMenuItem(e.key);
    };
    // -----

    if (shouldRedirect) return (<Navigate to="/login" />);
    return (
        <Menu onClick={onClick} selectedKeys={[currentMenuItem]} mode="horizontal" items={items} style={{marginBottom: 20}}/>
    )
}