import { useRoutes } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';

import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, theme } from 'antd';

import Router from '@/routers/router';

const App = () => {
    const element = useRoutes(Router);

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#00B96B',
                },
            }}
        >
            <StyleProvider hashPriority="high">{element}</StyleProvider>
        </ConfigProvider>
    );
};

export default App;
