// Created: 2026-08-27
import { create } from 'zustand';

type SnackbarState = {
    visible: boolean;
    message: string;
    show: (message: string) => void;
    hide: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
    visible: false,
    message: '',
    show: (message) => set({ message, visible: true }),
    hide: () => set({ visible: false }),
}));