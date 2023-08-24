import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  openDatePicker: () => void;
  closeDatePicker: () => void;
}

export const useDateStore = create<ModalState>()((set) => ({
  isOpen: false,
  openDatePicker: () => set({ isOpen: true }),
  closeDatePicker: () => set({ isOpen: false }),
}));
