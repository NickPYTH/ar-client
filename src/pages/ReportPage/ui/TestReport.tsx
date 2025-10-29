import {CalculatedTestModel} from "entities/CalculatedTestModel";
import {Divider, Flex, Table, TableProps, Typography} from "antd";
import React, {useEffect} from "react";
import {GroupPieChart} from "./GroupPieChart";

type PropsType = {
    data: CalculatedTestModel[];
    selectedGroupId: number;
    selectedTestId: number;
};

const {Text} = Typography;

export const TestReport = (props: PropsType) => {

    const [filteredData, setFilteredData] = React.useState<CalculatedTestModel[]>([]);

    useEffect(() => {
        let filteredDataBySelectedGroup = props.data.filter((record) => {
            if (record.user.groups.length == 0) return false;
            return record.user.groups[0].id == props.selectedGroupId && record.test.id == props.selectedTestId.toString();
        });
        let uniqueDataByUsers = filteredDataBySelectedGroup.reduce((acc:CalculatedTestModel[], record:CalculatedTestModel) => {
            if (!acc.find((r) => r.user.id == record.user.id)) {
                return acc.concat([record]);
            }
            return acc;
        }, []);
        setFilteredData(uniqueDataByUsers);
    }, [props.selectedGroupId, props.selectedTestId]);

    const columns: TableProps<CalculatedTestModel>['columns'] = [
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => (<div>{record.user.username}</div>),
        },
        {
            title: 'Группа',
            dataIndex: 'user',
            key: 'group',
            render: (_, record) => (<div>{record.user.groups.length > 0 ? record.user.groups[0].name : ""}</div>),
        },
        {
            title: 'Экзамен',
            dataIndex: 'title',
            key: 'title',
            render: (_, record) => (<div>{record.test.title}</div>),
        },
        {
            title: 'Лучший результат',
            dataIndex: 'test_user_question_answer_list',
            key: 'mark',
            render: (_, record) => {
                let bestAnswerCount = -1;
                props.data.filter((r:CalculatedTestModel) => r.user.id == record.user.id).map((r1:CalculatedTestModel) => {
                    let goodAnswersCount = r1.test_user_question_answer_list.reduce((acc: number, result) => {
                        if (result.answer.isCorrect) return acc + 1;
                        return acc;
                    }, 0);
                    if (goodAnswersCount > bestAnswerCount)
                        bestAnswerCount = goodAnswersCount
                });
                return (<div>{(bestAnswerCount / record.test.questions.length * 100)}%</div>);
            },
        },
        {
            title: 'Всего попыток',
            dataIndex: 'tries_count',
            key: 'tries_count',
            render: (_, record) => {
                return (<div>{props.data.filter((r:CalculatedTestModel) => r.user.id == record.user.id).length}</div>);
            },
        },
    ];

    return (
        <Flex vertical gap={'small'}>
            <Table
                bordered
                style={{width: '100vw'}}
                columns={columns}
                pagination={false}
                dataSource={filteredData}
            />
            <Divider />
            <Flex justify={'space-between'}>
                <Flex vertical gap={'small'} style={{height: 300}}>
                    <Text strong>Общий итог по учебной группе</Text>
                    <Text>Количество человек в группе: {filteredData.length}</Text>
                    <Text>Количество сдавших экзамен: {
                        filteredData.filter((record) => {
                            let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                                if (result.answer.isCorrect) return acc + 1;
                                return acc;
                            }, 0);
                            return goodAnswersCount / record.test.questions.length >= 0.6;
                        }).length
                    }</Text>
                    <Text>Количество не сдавших экзамен: {
                        filteredData.filter((record) => {
                            let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                                if (result.answer.isCorrect) return acc + 1;
                                return acc;
                            }, 0);
                            return goodAnswersCount / record.test.questions.length < 0.6;
                        }).length
                    }</Text>
                </Flex>
                {filteredData.length > 0 &&
                    <GroupPieChart data={filteredData}/>
                }
            </Flex>
        </Flex>
    )
}