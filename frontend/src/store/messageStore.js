import { create } from "zustand";

export const useMessageStore = create((set) => ({
  messages: [],
  latestMessage: null,

  addMessage: (msg) => {
    set((state) => {
      const exists = state.messages.some((m) => m.location === msg.location);
      if (!exists) {
        console.log("msg", msg.location);
        return {
          messages: [...state.messages, msg],
          latestMessage: msg,
        };
      }
      return state;
    });
  },
  clearLatest: () => ({ latestMessage: null }),
  nextMessage: () =>
    set((state) => {
      if (state.messages.length === 0) {
        alert(state.messages.length);
        return { latestMessage: null };
      }
      const newMessages = state.messages.slice(0, -1);
      const msg = state.messages[state.messages.length - 2];
      return {
        messages: newMessages,
        latestMessage: msg,
      };
    }),
}));
