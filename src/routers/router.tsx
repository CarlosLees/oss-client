import { Navigate } from 'react-router-dom';

import Index from '@/pages/Index';

export default [
    {
        path: '/index',
        element: <Index />,
    },
    {
        path: '/',
        element: <Navigate to="/index" />,
    },
];
