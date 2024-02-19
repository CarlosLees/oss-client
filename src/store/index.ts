import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreProps {
    key: string;
    setKey: (value: string) => void;

    secret: string;
    setSecret: (value: string) => void;

    endPoint: string;
    setEndPoint: (value: string) => void;

    bucket: string;
    setBucket: (value: string) => void;

    hasDomain: boolean;
    setHasDomain: (value: boolean) => void;

    domain: string;
    setDomain: (value: string) => void;
}

export const useStore = create(
    persist<StoreProps>(
        (set) => ({
            key: '',
            setKey: (key: string) => set({ key }),

            secret: '',
            setSecret: (secret: string) => set({ secret }),

            endPoint: '',
            setEndPoint: (endPoint: string) => set({ endPoint }),

            bucket: '',
            setBucket: (bucket: string) => set({ bucket }),

            hasDomain: true,
            setHasDomain: (hasDomain: boolean) => set({ hasDomain }),

            domain: '',
            setDomain: (domain: string) => set({ domain }),
        }),
        { name: 'oss' },
    ),
);
