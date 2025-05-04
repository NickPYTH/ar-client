import {Button, Card, Flex, GetProp, Tag, Upload, UploadProps, Image} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {host} from "shared/config/constants";

type ImageBlockProps = {
    setList: Function,
    item: ArticleItemType
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export const ImageBlock = (props:ImageBlockProps) => {

    // States
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>();
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
                    <Tag color={'processing'} style={{width: 70, marginBottom: 5}}>Номер: {props.item.order}</Tag>
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
                <Flex vertical style={{width: '15%'}}>
                    <Button danger onClick={removeItemHandler}>Удалить</Button>
                </Flex>
            </Flex>
        </Card>
    )
}