import { createSlice } from '@reduxjs/toolkit';

const mailSlice = createSlice({
  name: 'mail',
  initialState: {
    mails: [],
    unreadCount: 0,
  },
  reducers: {
    setMails(state, action) {
      state.mails = action.payload;
      state.unreadCount = action.payload.filter(mail => !mail.read).length;
    },
    markAsRead(state, action) {
      const mailId = action.payload;
      const mail = state.mails.find(m => m.id === mailId);
      if (mail && !mail.read) {
        mail.read = true;
        state.unreadCount--;
      }
    }
  },
});

export const mailActions = mailSlice.actions;
export default mailSlice.reducer;
