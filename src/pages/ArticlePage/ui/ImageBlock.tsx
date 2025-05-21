import {Button, Card, Flex, GetProp, Image, Popconfirm, Popover, Space, Tag, Upload, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";
import {ArrowDownOutlined, ArrowUpOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {host} from "shared/config/constants";

type ImageBlockProps = {
    list: ArticleItemType[],
    setList: Function,
    item: ArticleItemType
};

enum PositionType {
    UP,
    DOWN
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export const ImageBlock = (props:ImageBlockProps) => {

    // States
    const [order, setOrder] = useState(props.item.order);
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>();
    // -----

    // Effects
    useEffect(() => {
        setOrder(props.item.order);
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
    const loadImageHandler: UploadProps['onChange'] = (info) => {
        getBase64(info.file.originFileObj as FileType, (url) => {
            setLoading(false);
            setImageBase64(url);
            props.setList((prev: ArticleItemType[]) => prev.map((i:ArticleItemType) => i.order == props.item.order ? {...i, text: imageBase64} : i))
        });
    };
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
    };
    // -----

    // Useful utils
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Загрузить {props.item.text ? "другое" : ""} изображение</div>
        </button>
    );
    // -----

    return (
        <Card style={{width: '100%'}}>
            <Flex style={{width: '100%'}} justify={'space-evenly'}>
                <Flex style={{width: '83%'}} vertical>
                    <Tag color={'processing'} style={{width: 70, marginBottom: 5}}>Номер: {order}</Tag>
                    <Flex align={'center'} justify={'space-evenly'}>
                        <Image
                            width={200}
                            src={`${host}/api/articleImages/${props.item.text}/`}
                        />
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action=""
                            onChange={loadImageHandler}
                        >
                            {imageBase64 ? <img src={imageBase64} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Flex>
                </Flex>
                <Space direction='vertical' align='end' style={{width: '30%'}}>
                    <Space>
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