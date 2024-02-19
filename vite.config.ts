import { ConfigEnv, defineConfig, UserConfig } from 'vite';
import { getConfig } from './build';

// https://vitejs.dev/config/
export default defineConfig((params: ConfigEnv): UserConfig => {
    return getConfig(params);
});
