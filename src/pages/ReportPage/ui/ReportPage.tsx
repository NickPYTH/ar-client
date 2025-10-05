import {Flex, Table, TableProps} from "antd";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";
import {calculatedTestsAPI} from "service/CalculatedTestsService";
import React, {useEffect, useState} from "react";
import {CalculatedTestModel} from "entities/CalculatedTestModel";

export const ReportPage = () => {

    // Store
    const api = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<CalculatedTestModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = calculatedTestsAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleModal) setSelected(null);
    }, [isVisibleModal]);
    useEffect(() => {
        if (isDataError) showErrorNotification('topRight', 'Ошибка загрузки данных');
    }, [isDataError]);
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

    // Handlers

    // -----

    // Useful utils
    const columns: TableProps<CalculatedTestModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Группа',
            dataIndex: 'user',
            key: 'user',
            filters: data?.reduce((acc: { text: string, value: string }[], calculatedTestModel: CalculatedTestModel) => {
                if (calculatedTestModel.user.groups.length > 0) {
                    let group = calculatedTestModel.user.groups[0];
                    if (acc.find((g: {
                        text: string,
                        value: string
                    }) => g.text === group.name) === undefined)
                        return acc.concat({
                            text: group.name,
                            value: group.name
                        });
                    return acc;
                }
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, calculatedTestModel: CalculatedTestModel) => {
                if (calculatedTestModel.user.groups.length > 0) {
                    let group = calculatedTestModel.user.groups[0];
                    return group.name.indexOf(value) === 0
                }
                return false;
            },
            render: (_, record) => (<div>{record.user.groups.length > 0 ? record.user.groups[0].name : ""}</div>),
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            filters: data?.reduce((acc: { text: string, value: string }[], calculatedTestModel: CalculatedTestModel) => {
                    if (acc.find((g: {
                        text: string,
                        value: string
                    }) => g.text === calculatedTestModel.user.username) === undefined)
                        return acc.concat({
                            text: calculatedTestModel.user.username,
                            value: calculatedTestModel.user.username
                        });
                    return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, calculatedTestModel: CalculatedTestModel) => {
                return calculatedTestModel.user.username.indexOf(value) === 0;
            },
            render: (_, record) => (<div>{record.user.username}</div>),
        },
        {
            title: 'Экзамен',
            dataIndex: 'title',
            key: 'title',
            filters: data?.reduce((acc: { text: string, value: string }[], calculatedTestModel: CalculatedTestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === calculatedTestModel.test.title) === undefined)
                    return acc.concat({text: calculatedTestModel.test.title, value: calculatedTestModel.test.title});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: CalculatedTestModel) => {
                return record.test.title.indexOf(value) === 0
            },
            render: (_, record) => (<div>{record.test.title}</div>),
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            filters: data?.reduce((acc: { text: string, value: string }[], calculatedTestModel: CalculatedTestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === calculatedTestModel.test.description) === undefined)
                    return acc.concat({text: calculatedTestModel.test.description, value: calculatedTestModel.test.description});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: CalculatedTestModel) => {
                return record.test.description.indexOf(value) === 0
            },
            render: (_, record) => (<div>{record.test.description}</div>),
        },
        {
            title: 'Кол-во вопросов',
            dataIndex: 'test',
            key: 'questionCount',
            render: (_, record) => {
                return (<div>{record.test.questions.length}</div>);
            },
        },
        {
            title: 'Кол-во правильных ответов',
            dataIndex: 'test_user_question_answer_list',
            key: 'goodAnswersCount',
            render: (_, record) => {
                let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                    if (result.answer.isCorrect) return acc+1;
                    return acc;
                }, 0);
                return (<div>{goodAnswersCount}</div>);
            },
        },
    ];
    // -----

    return(
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            <Table
                bordered
                style={{width: '100vw'}}
                columns={columns}
                dataSource={data}
                loading={isDataLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleModal(true);
                            setSelected(record);
                        },
                    };
                }}
            />
        </Flex>
    );
}