import { Modal } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';

interface ModalComponentProps {
    width?: string;
    title: string;
    children?: ReactNode;
    beOpen: boolean;
    handleResult: (result: boolean) => Promise<void>;
}

const ModalComponent: FC<ModalComponentProps> = ({
    width,
    title,
    children,
    beOpen,
    handleResult,
}) => {
    const [openState, setOpenState] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpenState(beOpen);
    }, [beOpen]);

    const onOk = async () => {
        setLoading(true);
        await handleResult(true);
        setLoading(false);
    };

    return (
        <Modal
            width={width}
            title={title}
            open={openState}
            onOk={onOk}
            confirmLoading={loading}
            onCancel={() => handleResult(false)}
        >
            {children}
        </Modal>
    );
};

export default ModalComponent;
