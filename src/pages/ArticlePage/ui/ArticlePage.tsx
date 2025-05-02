import {Button, Card, Divider, Flex, Input, Space} from "antd";
import React, {useState} from "react";
import {useDrag, useDrop} from 'react-dnd'
import {TextBlock} from "pages/ArticlePage/ui/TextBlock";
import {ArrowLeftOutlined, EditOutlined, FieldStringOutlined, PictureOutlined, SaveOutlined} from "@ant-design/icons";
import {ImageBlock} from "pages/ArticlePage/ui/ImageBlock";

export type ArticleItemType = {
    order: number,
    type: string,
    text: string
}

const ArticlePage = () => {

    // States
    const [articleItemsList, setArticleItemsList] = useState<ArticleItemType[]>([]);
    const [title, setTitle] = useState<string>("Заголовок статьи");
    const [editModeTitle, setEditModeTitle] = useState(false);
    // -----


    // Web requests

    // -----

    // Effects

    // -----

    // Handlers
    const addItem = (itemType:any) => {
        let item:ArticleItemType = {
            order: 1,
            type: itemType,
            text: 'Тут пока пусто...'
        }
        setArticleItemsList(prev => {
            if (prev.length > 0) {
                let lastItem = prev.sort((item1: ArticleItemType, item2: ArticleItemType) => item2.order - item1.order)[0];
                item.order = lastItem.order + 1;
            }
            return prev.concat([item]);
        });
    }
    // -----

    // DND
    const [{ isDraggingText}, dragText] = useDrag(() => ({
        type: 'item',
        item: { type: 'text' },
        collect: (monitor) => ({
            isDraggingText: !!monitor.isDragging()
        })
    }));
    const [{ isDraggingImg }, dragImg] = useDrag(() => ({
        type: 'item',
        item: { type: 'img' },
        collect: (monitor) => ({
            isDraggingImg: !!monitor.isDragging()
        })
    }))
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'item',
            drop: (item:any) => {
                if (item.type == 'text') addItem('text');
                if (item.type == 'img') addItem('img');
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
        []
    )
    // -----

    return(
        <Flex justify={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} style={{width: '20%', marginRight: 20}}>
                <Flex justify={'space-between'} wrap={'wrap'}>
                    <Button icon={<ArrowLeftOutlined />} style={{marginBottom: 5}}>
                        Назад
                    </Button>
                    <Button icon={<SaveOutlined />}>
                        Сохранить
                    </Button>
                </Flex>
                <Divider style={{margin: 0, marginBottom: 5}}/>
                <Card ref={dragText} style={{cursor: 'pointer', opacity: (isDraggingText || isDraggingImg) ? 0.5 : 1,}}>
                    <Space>
                        <FieldStringOutlined  style={{fontSize: 24}}/>
                        Добавить блок с текстом
                    </Space>
                </Card>
                <Card ref={dragImg}>
                    <Space>
                        <PictureOutlined  style={{fontSize: 24}}/>
                        Добавить блок с картинкой
                    </Space>
                </Card>
            </Space>
            <Card ref={drop} style={{height: '90%', width: '60%', backgroundColor: isOver ? '#eee' : '#f7f7f7',}}>
                <Space direction={"vertical"} style={{width: '100%'}}>
                    <Flex align={'center'}>
                        {editModeTitle && <Input style={{width: 400}} value={title} onChange={(e) => setTitle(e.target.value)}/>}
                        {!editModeTitle &&  <h3>{title}</h3>}
                        <Button onClick={() => setEditModeTitle(prev => !prev)} style={{marginLeft: 5}} size={'small'} variant={'outlined'} color={'primary'} icon={editModeTitle ? <SaveOutlined /> : <EditOutlined />}/>
                    </Flex>
                    {articleItemsList.sort((item1: ArticleItemType, item2: ArticleItemType) => item1.order - item2.order).map((item:any) => item.type == 'text' ?
                        <TextBlock item={item} setList={setArticleItemsList}/>
                    :
                        <ImageBlock item={item} setList={setArticleItemsList}/>
                    )}
                </Space>
            </Card>
        </Flex>
    )
}

export default ArticlePage;