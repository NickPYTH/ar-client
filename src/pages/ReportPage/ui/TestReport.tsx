import {CalculatedTestModel} from "entities/CalculatedTestModel";
import {Flex, Table, TableProps, Typography} from "antd";
import React from "react";

type PropsType = {
    data: CalculatedTestModel[];
    selectedGroupId: number;
    selectedTestId: number;
};

const {Text} = Typography;

export const TestReport = (props: PropsType) => {

    const columns: TableProps<CalculatedTestModel>['columns'] = [
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => (<div>{record.user.username}</div>),
        },
        {
            title: 'Результат',
            dataIndex: 'test_user_question_answer_list',
            key: 'mark',
            render: (_, record) => {
                let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                    if (result.answer.isCorrect) return acc + 1;
                    return acc;
                }, 0);
                return (<div>{(goodAnswersCount / record.test.questions.length * 100)}%</div>);
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
                dataSource={props.data.filter((rec) => {
                    if (rec.user.groups.length == 0) return false;
                    return rec.user.groups[0].id == props.selectedGroupId && rec.test.id == props.selectedTestId.toString();
                })}
            />
            <Text>Общий итог по учебной группе</Text>
            <Text>Количество человек в группе: {props.data.length}</Text>
            <Text>Количество сдавших экзамен: {
                props.data.filter((record) => {
                    let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                        if (result.answer.isCorrect) return acc + 1;
                        return acc;
                    }, 0);
                    return goodAnswersCount / record.test.questions.length >= 0.6;
                }).length
            }</Text>
            <Text>Количество не сдавших экзамен: {
                props.data.filter((record) => {
                    let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                        if (result.answer.isCorrect) return acc + 1;
                        return acc;
                    }, 0);
                    return goodAnswersCount / record.test.questions.length < 0.6;
                }).length
            }</Text>
        </Flex>
    )
}