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
    },
    deleteMail(state, action) {
       state.mails = state.mails.filter(mail => mail.id !== action.payload);
       state.unreadCount = state.mails.filter(mail => !mail.read).length;
}
  },
});

export const mailActions = mailSlice.actions;
export default mailSlice.reducer;
