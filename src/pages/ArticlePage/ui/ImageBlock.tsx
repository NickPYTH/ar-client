import {Button, Card, Flex, GetProp, Tag, Upload, UploadProps} from "antd";
import React, {useState} from "react";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

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
        });
    };
    // -----

    // Useful utils
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Загрузить изображение</div>
        </button>
    );
    // -----

    return (
        <Card style={{width: '100%'}}>
            <Flex style={{width: '100%'}} justify={'space-evenly'}>
                <Flex style={{width: '83%'}} vertical>
                    <Tag color={'processing'} style={{width: 70, marginBottom: 5}}>Номер: {props.item.order}</Tag>
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
                <Flex vertical style={{width: '15%'}}>
                    <Button danger onClick={removeItemHandler}>Удалить</Button>
                </Flex>
            </Flex>
        </Card>
    )
}