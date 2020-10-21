import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactText } from 'react';
import { Slot } from '../../models/slot.model';
import { Purchase } from '../Purchases/Purchases';

interface SlotsState {
  slots: Slot[];
}

const createSlot = (): Slot => ({
  id: Math.random(),
  extra: null,
  amount: null,
  name: '',
});

const initialState: SlotsState = {
  slots: Array(20)
    .fill(0)
    .map(() => createSlot()),
};

const getAmountSum = (slot: Slot): number | null => (slot.extra ? Number(slot.amount) + slot.extra : slot.amount);

const slotsSlice = createSlice({
  name: 'slots',
  initialState,
  reducers: {
    setSlotName(state, action: PayloadAction<{ id: ReactText; name: string }>): void {
      const { id, name } = action.payload;
      state.slots = state.slots.map((slot) => (slot.id === id ? { ...slot, name } : slot));
    },
    setSlotAmount(state, action: PayloadAction<{ id: ReactText; amount: number }>): void {
      const { id, amount } = action.payload;
      state.slots = state.slots.map((slot) => (slot.id === id ? { ...slot, amount } : slot));
    },
    setSlotExtra(state, action: PayloadAction<{ id: ReactText; extra: number }>): void {
      const { id, extra } = action.payload;
      state.slots = state.slots.map((slot) => (slot.id === id ? { ...slot, extra } : slot));
    },
    addExtra(state, action: PayloadAction<ReactText>): void {
      const id = action.payload;
      state.slots = state.slots.map((slot) =>
        slot.id === id ? { ...slot, extra: null, amount: getAmountSum(slot) } : slot,
      );
    },
    deleteSlot(state, action: PayloadAction<ReactText>): void {
      if (state.slots.length === 1) {
        state.slots = initialState.slots;
        return;
      }
      const deletedId = action.payload;
      state.slots = state.slots.filter(({ id }) => deletedId !== id);
    },
    addSlot(state): void {
      state.slots = [...state.slots, createSlot()];
    },
    createSlotFromPurchase(state, action: PayloadAction<Purchase>): void {
      const { id, message: name, cost: amount } = action.payload;
      const newSlot: Slot = { id, name, amount, extra: null };
      state.slots = [...state.slots, newSlot];
    },
    resetSlots(state): void {
      state.slots = initialState.slots;
    },
    setSlots(state, action: PayloadAction<Slot[]>): void {
      state.slots = action.payload;
    },
  },
});

export const {
  setSlotAmount,
  setSlotExtra,
  setSlotName,
  addExtra,
  addSlot,
  createSlotFromPurchase,
  deleteSlot,
  resetSlots,
  setSlots,
} = slotsSlice.actions;

export default slotsSlice.reducer;
