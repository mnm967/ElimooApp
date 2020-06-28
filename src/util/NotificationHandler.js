export default class NotificationHandler {
    static notificationCallback;

    static setNotificationHandler(notificationCallback) {
        this.notificationCallback = notificationCallback;
    }
  }