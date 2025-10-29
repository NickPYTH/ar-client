import {Button, Card, Divider, Empty, Flex, Input, Popover, Space, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {useDrag, useDrop} from 'react-dnd'
import {TextBlock} from "pages/ArticlePage/ui/TextBlock";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    EditOutlined,
    FieldStringOutlined,
    PictureOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {ImageBlock} from "pages/ArticlePage/ui/ImageBlock";
import {articleAPI} from "service/ArticleService";
import {useNavigate} from "react-router-dom";

export type ArticleItemType = {
    order: number,
    type: string,
    text: string
}

const ArticlePage = () => {

    // States
    let navigate = useNavigate();
    const [isEditMode] = useState(() => {
        let num = window.location.pathname.split('/')[3];
        return !Number.isNaN(Number(num));
    });
    const [id] = useState<number | null>(() => {
        let num = window.location.pathname.split('/')[3];
        if (Number.isNaN(Number(num))) return null;
        else return Number(num);
    });
    const [courseId] = useState<number | null>(() => {
        let num = window.location.pathname.split('/')[2];
        if (Number.isNaN(Number(num))) return null;
        else return Number(num);
    });
    const [articleItemsList, setArticleItemsList] = useState<ArticleItemType[]>([]);
    const [title, setTitle] = useState<string>("Заголовок статьи");
    const [editModeTitle, setEditModeTitle] = useState(false);
    // -----

    // Web requests
    const [createArticle, {
        isSuccess
    }] = articleAPI.useCreateMutation();
    const [getArticle, {
        data: articleData,
        isLoading: isArticleLoading
    }] = articleAPI.useGetMutation();
    // -----

    // Effects
    useEffect(() => {
        if (id) getArticle(id);
    }, []);
    useEffect(() => {
        if (articleData){
            setTitle(articleData.title);
            setArticleItemsList(articleData.body.split(">>>").filter((data:string) => data.length > 0).map((data:string, num:number) => {
                const imageRE = /image_\d+/;
                let item:ArticleItemType = {
                    order: num+1,
                    text: data,
                    type: imageRE.test(data) ? "img" : "text"
                };
                return item;
            }));
        }
    }, [articleData]);
    useEffect(() => {
        if (isSuccess) navigate(-1);
    }, [isSuccess]);
    // -----

    // Handlers
    const saveHandler = () => {
        if (courseId) {
            createArticle({
                id,
                title,
                articleItemsList,
                courseId,
                // Нахуй не нужные свойства
                body: "",
                pub_date: "",
                author: ""
                // -----
            })
        }
    }
    const addItem = (itemType:string) => {
        let item:ArticleItemType = {
            order: 1,
            type: itemType,
            text: itemType=='img' ? '' : 'Тут пока пусто...'
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

    if (isArticleLoading) return (<Flex vertical align={'center'} style={{width: window.innerWidth}}>
        <Spin size='large' style={{margin: 50}} />
    </Flex>)
    return(
        <Flex justify={'center'} style={{width: window.innerWidth}}>
            <Flex vertical style={{marginRight: 20}} gap={'small'}>
                <Flex justify={'space-between'} wrap={'wrap'} gap={'small'}>
                    <Button icon={<ArrowLeftOutlined />}onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Button icon={<SaveOutlined />} onClick={saveHandler}>
                        {isEditMode ? 'Сохранить' : 'Создать'}
                    </Button>
                </Flex>
                <Divider />
                <Card ref={dragText} style={{cursor: 'pointer', opacity: (isDraggingText || isDraggingImg) ? 0.5 : 1,}}>
                    <Flex justify='space-between' align='center' gap={'small'}>
                        <FieldStringOutlined  style={{fontSize: 24}}/>
                        Блок с текстом
                        <Popover content={() => <div style={{fontWeight: 200}}>Добавить блок с текстом</div>}>
                            <Button onClick={() => addItem('text')} icon={<ArrowRightOutlined/>}/>
                        </Popover>
                    </Flex>
                </Card>
                <Card ref={dragImg} style={{cursor: 'pointer', opacity: (isDraggingText || isDraggingImg) ? 0.5 : 1,}}>
                    <Flex justify='space-between' align='center' gap={'small'}>
                        <PictureOutlined  style={{fontSize: 24}}/>
                        Блок с картинкой
                        <Popover content={() => <div style={{fontWeight: 200}}>Добавить блок с картинкой</div>}>
                            <Button onClick={() => addItem('img')} icon={<ArrowRightOutlined/>}/>
                        </Popover>
                    </Flex>
                </Card>
            </Flex>
            <Card ref={drop} style={{height: '90%', width: '60%', backgroundColor: isOver ? '#eee' : '#f7f7f7',}}>
                <Space direction={"vertical"} style={{width: '100%'}}>
                    <Flex align={'center'}>
                        {editModeTitle && <Input style={{width: 400}} value={title} onChange={(e) => setTitle(e.target.value)}/>}
                        {!editModeTitle &&  <h3>{title}</h3>}
                        <Button onClick={() => setEditModeTitle(prev => !prev)} style={{marginLeft: 5}} size={'small'} variant={'outlined'} color={'primary'} icon={editModeTitle ? <SaveOutlined /> : <EditOutlined />}/>
                    </Flex>
                    {articleItemsList.length == 0 && <Empty/>}
                    {articleItemsList.sort((item1: ArticleItemType, item2: ArticleItemType) => item1.order - item2.order).map((item:any) => item.type == 'text' ?
                        <TextBlock list={articleItemsList} item={item} setList={setArticleItemsList}/>
                    :
                        <ImageBlock list={articleItemsList} item={item} setList={setArticleItemsList}/>
                    )}
                </Space>
            </Card>
        </Flex>
    )
}

export default ArticlePage;