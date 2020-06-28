package com.elimoo;

import com.onesignal.OSNotificationPayload;
import com.onesignal.OSNotificationPayload;
import com.onesignal.OSNotificationPayload;
import com.onesignal.NotificationExtenderService;
import com.onesignal.OSNotificationReceivedResult;

public class NotificationExtender extends NotificationExtenderService {
   @Override
   protected boolean onNotificationProcessing(OSNotificationReceivedResult receivedResult) {
        // Read properties from result.

      // Return true to stop the notification from displaying.
      return false;
   }
}