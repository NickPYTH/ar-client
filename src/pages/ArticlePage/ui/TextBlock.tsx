import {Button, Card, Flex, Input, Tag} from "antd";
import React, {useState} from "react";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";

const { TextArea } = Input;

type TextBlockProps = {
    setList: Function,
    item: ArticleItemType
}
export const TextBlock = (props:TextBlockProps) => {

    // States
    const [isEditMode, setIsEditMode] = useState(false);
    const [text, setText] = useState(props.item.text);
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
    // -----

    return (
        <Card style={{width: '100%'}}>
            <Flex style={{width: '100%'}} justify={'space-evenly'}>
                <Flex style={{width: '83%'}} vertical>
                    <Tag color={'processing'} style={{width: 70, marginBottom: 5}}>Номер: {props.item.order}</Tag>
                    {isEditMode ?
                        <TextArea rows={8} value={text} onChange={(e) => setText(e.target.value)}/>
                        :
                        text
                    }
                </Flex>
                <Flex vertical style={{width: '15%'}}>
                    <Button style={{marginBottom: 5}} onClick={modeHandler}>{isEditMode ? "Сохранить": "Редактировать"}</Button>
                    <Button danger onClick={removeItemHandler}>Удалить</Button>
                </Flex>
            </Flex>
        </Card>
    )
}