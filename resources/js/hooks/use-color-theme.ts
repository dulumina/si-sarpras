import { useSyncExternalStore } from 'react';

export interface ColorThemeOption {
    name: string;
    key: string;
    color: string;
}

export const colorThemes: ColorThemeOption[] = [
    { name: 'Indigo', key: 'indigo', color: '#6366f1' },
    { name: 'Blue', key: 'blue', color: '#1677ff' },
    { name: 'Cyan', key: 'cyan', color: '#13c2c2' },
    { name: 'Teal', key: 'teal', color: '#08979c' },
    { name: 'Green', key: 'green', color: '#52c41a' },
    { name: 'Lime', key: 'lime', color: '#a0d911' },
    { name: 'Purple', key: 'purple', color: '#722ed1' },
    { name: 'Magenta', key: 'magenta', color: '#eb2f96' },
    { name: 'Red', key: 'red', color: '#f5222d' },
    { name: 'Volcano', key: 'volcano', color: '#fa541c' },
    { name: 'Orange', key: 'orange', color: '#fa8c16' },
    { name: 'Gold', key: 'gold', color: '#faad14' },
];

const listeners = new Set<() => void>();
let currentColorKey: string = 'indigo';

const getStoredColorKey = (): string => {
    if (typeof window === 'undefined') {
        return 'indigo';
    }

    return localStorage.getItem('color_theme') || 'indigo';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const getSnapshot = () => currentColorKey;

const getServerSnapshot = () => 'indigo';

const notify = () => listeners.forEach((listener) => listener());

export function getCurrentColorKey(): string {
    return currentColorKey;
}

export function initializeColorTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentColorKey = getStoredColorKey();
}

export function useColorTheme(): {
    colorKey: string;
    color: string;
    updateColorTheme: (key: string) => void;
} {
    const colorKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const color = colorThemes.find((t) => t.key === colorKey)?.color || '#6366f1';

    const updateColorTheme = (key: string) => {
        currentColorKey = key;
        localStorage.setItem('color_theme', key);
        notify();
    };

    return { colorKey, color, updateColorTheme };
}
