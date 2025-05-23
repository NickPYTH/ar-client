import {userAPI} from "service/UserService";
import React, {useEffect, useState} from "react";
import {Menu, MenuProps, NotificationArgsProps} from "antd";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {useLocation, useNavigate} from "react-router-dom";
import {LogoutOutlined} from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Курсы',
        key: 'course_list',
    },
    {
        label: 'Выйти',
        key: 'logout',
        icon: <LogoutOutlined />,
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
        if (window.location.pathname.indexOf('login') == -1) {
            if (accessToken && refreshToken) {
                verifyTokenRequest({token: accessToken});
            } else {
                localStorage.clear();
                navigate('/login');
            }
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
            navigate('/login');
        }
    }, [refreshTokenIsError])
    // -----

    // Handlers
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key == 'course_list') navigate('/course_list')
        if (e.key == 'logout') {
            localStorage.clear();
            navigate('/login');
        }
        setCurrentMenuItem(e.key);
    };
    // -----

    if (window.location.pathname.indexOf('login') == -1) return (
        <Menu onClick={onClick} selectedKeys={[currentMenuItem]} mode="horizontal" items={items} style={{marginBottom: 20}}/>
    );
    return (<></>)
}