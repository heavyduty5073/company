import { create } from 'zustand';

type ReservationMap = Map<string, boolean>; // key: 'YYYY-MM-DD', value: isFullyClosed

interface ScheduleStore {
    reservationStatus: ReservationMap;
    setReservationStatus: (date: string, isFull: boolean) => void;
    bulkSetReservationStatus: (bulkMap: ReservationMap) => void;
    getDateStatus: (date: string) => boolean;
    reset: () => void;
    showForm:boolean;
    setShowForm:(show:boolean)=>void;
    toggleShowForm:()=>void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
    reservationStatus: new Map(),
    showForm:false,
    setReservationStatus: (date, isFull) =>
        set((state) => {
            const updated = new Map(state.reservationStatus);
            updated.set(date, isFull);
            return { reservationStatus: updated };
        }),

    bulkSetReservationStatus: (bulkMap) =>
        set(() => ({
            reservationStatus: new Map(bulkMap),
        })),

    getDateStatus: (date: string) => {
        const status = get().reservationStatus.get(date);
        return status === undefined ? true : !status;
        // status === true -> 예약 마감 -> false 반환
    },
    setShowForm: (show: boolean) =>
        set(() => ({ showForm: show })),

    toggleShowForm: () =>
        set((state) => ({ showForm: !state.showForm })),
    reset: () => set(() => ({
        reservationStatus: new Map(),
        showForm: false
    })),
}));

