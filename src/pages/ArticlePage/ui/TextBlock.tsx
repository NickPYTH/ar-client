import {Button, Card, Flex, Input, Popconfirm, Popover, Space, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";

const { TextArea } = Input;

type TextBlockProps = {
    list: ArticleItemType[],
    setList: Function,
    item: ArticleItemType
}

enum PositionType {
    UP,
    DOWN
}

export const TextBlock = (props:TextBlockProps) => {

    // States
    const [isEditMode, setIsEditMode] = useState(false);
    const [order, setOrder] = useState(props.item.order);
    const [text, setText] = useState(props.item.text);
    // -----

    // Effects
    useEffect(() => {
        setOrder(props.item.order);
        setText(props.item.text);
    }, [props.item]);
    // -----

    // Handlers
    const removeItemHandler = () => {
        props.setList((prev:ArticleItemType[]) => {
            let deepCopy:ArticleItemType[] = JSON.parse(JSON.stringify(prev));
            deepCopy = deepCopy.filter((i:ArticleItemType) => i.order != props.item.order);
            return deepCopy.map((i:ArticleItemType, number) => ({...i, order: number+1}));
        });
    };
    const modeHandler = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode) { // Момент сохранения
            props.setList((prev: ArticleItemType[]) => prev.map((i:ArticleItemType) => i.order == props.item.order ? {...i, text} : i))
        }
    }
    const changePositionHandler = (position:PositionType) => {
        props.setList((prev:ArticleItemType[]) => {
            let prevItem: ArticleItemType | undefined = prev.find((item:ArticleItemType) => item.order == (position == PositionType.UP ? props.item.order-1 : props.item.order+1));
            let currentItem: ArticleItemType | undefined = prev.find((item:ArticleItemType) => item.order == props.item.order);
            if (prevItem && currentItem) {
                prevItem.order = props.item.order;
                currentItem.order = position == PositionType.UP ? props.item.order - 1 : props.item.order + 1;
            }
            return JSON.parse(JSON.stringify(prev));
        });
    }
    // -----

    return (
        <Card style={{width: '100%'}}>
            <Flex style={{width: '100%'}} justify={'space-evenly'}>
                <Flex style={{width: '70%'}} vertical>
                    <Tag color={'processing'} style={{width: 70, marginBottom: 5}}>Номер: {order}</Tag>
                    {isEditMode ?
                        <TextArea rows={8} value={text} onChange={(e) => setText(e.target.value)}/>
                        :
                        text
                    }
                </Flex>
                <Space direction='vertical' align='end' style={{width: '30%'}}>
                    <Space>
                        <Button style={{width: 135}} onClick={modeHandler}>{isEditMode ? "Сохранить": "Редактировать"}</Button>
                        <Popover content={() => <div style={{fontWeight: 200}}>Поднять</div>}>
                            <Button onClick={() => changePositionHandler(PositionType.UP)} disabled={props.item.order == 1} icon={<ArrowUpOutlined />}/>
                        </Popover>
                    </Space>
                    <Space>
                        <Popconfirm onConfirm={removeItemHandler} title={"Вы точно хотите удалить?"}>
                            <Button style={{width: 135}} danger>Удалить</Button>
                        </Popconfirm>
                        <Popover placement='right' content={() => <div style={{fontWeight: 200}}>Опустить</div>}>
                            <Button onClick={() => changePositionHandler(PositionType.DOWN)} disabled={props.item.order == props.list.length} icon={<ArrowDownOutlined />}/>
                        </Popover>
                    </Space>
                </Space>
            </Flex>
        </Card>
    )
}