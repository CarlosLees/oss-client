import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons/lib/icons';
import { message, open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { Button, Form, FormInstance, Input, Switch } from 'antd';
import { invoke } from '@tauri-apps/api';
import { SettingOutlined } from '@ant-design/icons';

import ModalComponent from '@/component/ModalComponent';
import { useStore } from '@/store';

const Index: React.FC = () => {
    const key = useStore((state) => state.key);
    const setKey = useStore((state) => state.setKey);

    const secret = useStore((state) => state.secret);
    const setSecret = useStore((state) => state.setSecret);

    const endPoint = useStore((state) => state.endPoint);
    const setEndPoint = useStore((state) => state.setEndPoint);

    const bucket = useStore((state) => state.bucket);
    const setBucket = useStore((state) => state.setBucket);

    const hasDomain = useStore((state) => state.hasDomain);
    const setHasDomain = useStore((state) => state.setHasDomain);

    const domain = useStore((state) => state.domain);
    const setDomain = useStore((state) => state.setDomain);

    const [url, setUrl] = useState('');
    const [systemUrl, setSystemUrl] = useState('');
    const [ossUrl, setOssUrl] = useState('');

    const [modalOpenState, setModalOpenState] = useState(false);
    const formRef = useRef<FormInstance>(null);
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    const branchModalResult = async (result: boolean) => {
        console.log(formRef.current!.getFieldValue('hasDomain'));
        if (result) {
            setModalOpenState(false);
            const appKey = formRef.current!.getFieldValue('app_key');
            const appSecret = formRef.current!.getFieldValue('app_secret');
            const appEndPoint = formRef.current!.getFieldValue('end_point');
            const appBucket = formRef.current!.getFieldValue('bucket');
            const switchState = formRef.current!.getFieldValue('hasDomain');
            const domainValue = formRef.current!.getFieldValue('domain');

            if (!appKey || !appSecret || !endPoint || !bucket) {
                return;
            }
            setKey(appKey);
            setSecret(appSecret);
            setEndPoint(appEndPoint);
            setBucket(appBucket);
            setHasDomain(switchState);

            console.log(switchState);
            console.log(domainValue);
            if (switchState) {
                console.log(123);
                setDomain(domainValue);
            }
        } else {
            setModalOpenState(false);
        }
    };

    const openDir = async () => {
        const selected = await open({ multiple: false });
        if (typeof selected === 'string') {
            setSystemUrl(selected);
            const contents = await readBinaryFile(selected);
            console.log(contents.length);
            // 转换为blob对象，然后转换为url
            const blob = new Blob([contents]);
            setUrl(URL.createObjectURL(blob));
            setOssUrl('');
        }
    };

    const upload = async () => {
        if (url) {
            const res: string = await invoke('upload', {
                data: {
                    appKey: key,
                    appSecret: secret,
                    endPoint,
                    bucket,
                    file: systemUrl,
                    hasDomain,
                    domain,
                },
            });
            await message(`上传成功,${res}`, { title: '上传结果', type: 'info' });
            setOssUrl(res);
            setSystemUrl('');
            setUrl('');
        }
    };

    return (
        <div>
            <div
                className="border border-dashed h-[150px] text-center cursor-pointer rounded-2xl m-[2px]"
                onClick={openDir}
            >
                <p className="ant-upload-drag-icon text-[48px] text-green-500">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                <p className="ant-upload-hint">支持单次或批量上传</p>
            </div>
            <div
                className="absolute bottom-4 right-4 cursor-pointer flex flex-col justify-center items-center"
                onClick={() => setModalOpenState(true)}
            >
                <SettingOutlined className="text-[20px] text-center text-green-600" />
                设置
            </div>

            <ModalComponent
                title="oss配置信息"
                beOpen={modalOpenState}
                handleResult={branchModalResult}
            >
                <Form {...formItemLayout} style={{ maxWidth: 600 }} ref={formRef}>
                    <Form.Item
                        label="app_key"
                        name="app_key"
                        rules={[{ required: true, message: '分院名称不能为空' }]}
                        initialValue={key}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="app_secret"
                        name="app_secret"
                        rules={[{ required: true, message: 'imei不能为空' }]}
                        initialValue={secret}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="end_point"
                        name="end_point"
                        rules={[{ required: true, message: 'imei不能为空' }]}
                        initialValue={endPoint}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="bucket"
                        name="bucket"
                        rules={[{ required: true, message: 'imei不能为空' }]}
                        initialValue={bucket}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="是否自定义域名"
                        name="hasDomain"
                        valuePropName="checked"
                        initialValue={hasDomain}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label="自定义域名"
                        name="domain"
                        rules={[{ required: false, message: 'imei不能为空' }]}
                        initialValue={domain}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </ModalComponent>

            {url && (
                <div>
                    <img src={url} alt="上传图片" />
                    <Button onClick={() => setUrl('')}>清除</Button>
                    <Button onClick={upload}>上传</Button>
                </div>
            )}
            {ossUrl && <p>{ossUrl}</p>}
        </div>
    );
};

export default Index;
