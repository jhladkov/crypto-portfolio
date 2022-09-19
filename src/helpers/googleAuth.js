export const googleAuth = (handle) => {
  window.google.accounts.id.initialize({
    client_id: process.env.VUE_APP_TITLE,
    cancel_on_tap_outside: false,
    callback: handle,
  });
  window.google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed) {
      // TODO: Handle err
    }
  });
};
