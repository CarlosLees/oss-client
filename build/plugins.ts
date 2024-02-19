import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';
import vitePluginForArco from '@arco-plugins/vite-react';

export function getPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [
        react(),
        vitePluginForArco({ style: 'css' }),
    ];
    return vitePlugins;
}
