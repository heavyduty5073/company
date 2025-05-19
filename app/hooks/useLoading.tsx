// stores/useLoadingStore.ts
import { create } from 'zustand';

interface LoadingState {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    startLoading: () => void;
    stopLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false }),
}));

export default useLoadingStore;