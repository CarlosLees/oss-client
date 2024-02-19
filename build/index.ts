import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { Configure } from './types';
import { pathResolve } from './utils';
import { getPlugins } from './plugins';

export const getConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
            plugins: getPlugins(isBuild),
            clearScreen: false,
            // tauri expects a fixed port, fail if that port is not available
            server: {
                port: 1420,
                strictPort: true,
            },
            envPrefix: ['VITE_', 'TAURI_'],
            build: {
                // Tauri supports es2021
                target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
                // don't minify for debug builds
                minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
                // produce sourcemaps for debug builds
                sourcemap: !!process.env.TAURI_DEBUG,
            },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
