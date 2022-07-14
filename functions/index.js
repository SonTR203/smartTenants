const functions = require("firebase-functions");
const { Expo } = require("expo-server-sdk");

const admin = require("firebase-admin");
admin.initializeApp();

const log = functions.logger.log;

// Send notifications to all inactive users when a new message is posted
exports.notificationsNewMessage = functions.firestore
  .document("MessagingList/{documentId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    // Get info of the oncoming message
    const newValue = snap.data();
    const documentId = context.params.documentId;
    // console.log("NEW VALUE: ", newValue);
    const { senderName, content, otherPersonId, senderId } = newValue;

    let otherPersonExpoPushToken = "";

    // Get the correct Expo push token of the other person
    // to send the notification
    await admin
      .firestore()
      .collection(`ExpoPushTokens`)
      .where("id", "==", otherPersonId)
      // .where("isActive", "==", false)
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const data = doc.data();
          // console.log(
          //   "other inactive people expo push token: ",
          //   data.expoPushToken
          // );
          otherPersonExpoPushToken = data.expoPushToken;
        });
      });
    // console.log("otherPersonExpoPushToken", otherPersonExpoPushToken, query);

    // send notifications to the other person
    if (otherPersonExpoPushToken.length > 0) {
      sendPushNotification(otherPersonExpoPushToken, senderName, content);
    }

    // update latest message in the conversation
    const updateLastMessageObj = {
      content: content,
      senderFirstName: senderName.split(" ")[0],
      senderId: senderId,
      seen: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const res = await admin
      .firestore()
      .collection(`MessagingList`)
      .doc(documentId)
      .get()
      .then((result) => {
        console.log(result);
        if (result) {
          result.ref.update({ lastMessage: updateLastMessageObj });
        }
      })
      .catch((err) => {
        console.log("Error getting document to update Last Message", err);
      });
    console.log("updateObj", updateLastMessageObj, res);
  });

// Send notifications to all inactive users when a new message is posted
exports.notificationsNewNotice = functions.firestore
  .document("Notices/{documentId}")
  .onCreate(async (snap) => {
    // Get info of the oncoming message
    const newValue = snap.data();
    const { recipients, content, subject } = newValue;

    let ExpoPushTokenList = [];

    await admin
      .firestore()
      .collection(`ExpoPushTokens`)
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const data = doc.data();
          // Get the correct Expo push token of the recipients
          if (recipients.includes(data.id)) {
            ExpoPushTokenList.push(data.expoPushToken);
          }
        });
      });

    // send notifications to the recipients
    if (ExpoPushTokenList.length > 0) {
      ExpoPushTokenList.forEach((token) => {
        sendPushNotification(token, subject, content);
      });
    }
  });

// Send notifications to all inactive users when a new message is posted
exports.notificationsNewAnnouncement = functions.firestore
  .document("Announcements/{documentId}")
  .onCreate(async (snap) => {
    // Get info of the oncoming message
    const newValue = snap.data();
    const { recipients, content, subject } = newValue;

    let ExpoPushTokenList = [];

    await admin
      .firestore()
      .collection(`ExpoPushTokens`)
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const data = doc.data();
          // Get the correct Expo push token of the recipients
          if (recipients.includes(data.id)) {
            ExpoPushTokenList.push(data.expoPushToken);
          }
        });
      });

    // send notifications to the recipients
    if (ExpoPushTokenList.length > 0) {
      ExpoPushTokenList.forEach((token) => {
        sendPushNotification(token, subject, content);
      });
    }
  });

// Send notifications to all inactive users when a new message is posted
exports.notificationsNewComment = functions.firestore
  .document("Newsfeed/{parentId}/peopleWhoCommented/{childId}")
  .onWrite(async (change) => {
    if (change.before.exists === false && change.after.exists === true) {
      log("new people commented on the post, send notification");
      log("data after: ", change.after.data());
      let authorExpoPushToken = "";
      const { authorID, firstName, lastName, postID, userID, id } =
        change.after.data();
      log("authorID", authorID);
      log("userID", userID);

      await admin
        .firestore()
        .collection(`ExpoPushTokens`)
        .where("id", "==", authorID)
        // .where("isActive", "==", false)
        .get()
        .then((result) => {
          result.forEach((doc) => {
            const data = doc.data();
            console.log("author expo push token: ", data.expoPushToken);
            authorExpoPushToken = data.expoPushToken;
          });
        });

      // send notifications to the author if someone else liked the post
      if (authorID !== userID) {
        log("sending notification to author", authorExpoPushToken);
        if (authorExpoPushToken.length > 0) {
          sendPushNotification(
            authorExpoPushToken,
            "",
            `${firstName} ${lastName} commented on your post.`,
            { postID: postID }
          );
        }

        await createNotificationItemInFirestore(
          authorID,
          userID,
          postID,
          firstName,
          lastName,
          id,
          `${firstName} ${lastName} commented on your post.`
        );
      }
    } else if (change.before.exists === true && change.after.exists === false) {
      log(
        "someone uncommented on the post, delete notification in Notifications screen"
      );
      log("data before: ", change.before.data());
      const { authorID, id } = change.before.data();
      await deleteNotificationItemInFirestore(authorID, id);
    }
  });

// Send notifications to all inactive users when a new message is posted
exports.notificationsNewLike = functions.firestore
  .document("Newsfeed/{parentId}/peopleWhoLiked/{childId}")
  .onWrite(async (change) => {
    if (change.before.exists === false && change.after.exists === true) {
      log("new people like the post, send notification");
      log("data after: ", change.after.data());
      let authorExpoPushToken = "";
      const { authorID, firstName, lastName, postID, userID, id } =
        change.after.data();
      log("authorID", authorID);
      log("userID", userID);

      await admin
        .firestore()
        .collection(`ExpoPushTokens`)
        .where("id", "==", authorID)
        // .where("isActive", "==", false)
        .get()
        .then((result) => {
          result.forEach((doc) => {
            const data = doc.data();
            console.log("author expo push token: ", data.expoPushToken);
            authorExpoPushToken = data.expoPushToken;
          });
        });

      // send notifications to the author if someone else liked the post
      if (authorID !== userID) {
        log("sending notification to author", authorExpoPushToken);
        if (authorExpoPushToken.length > 0) {
          sendPushNotification(
            authorExpoPushToken,
            "",
            `${firstName} ${lastName} liked your post.`,
            { postID: postID }
          );
        }
        await createNotificationItemInFirestore(
          authorID,
          userID,
          postID,
          firstName,
          lastName,
          id,
          `${firstName} ${lastName} liked your post.`
        );
      }
    } else if (change.before.exists === true && change.after.exists === false) {
      log(
        "someone unlike the post, delete notification in Notifications screen"
      );
      log("data before: ", change.before.data());
      const { authorID, id } = change.before.data();
      await deleteNotificationItemInFirestore(authorID, id);
    }
  });

// Update old posts with new user Profile Picture
// Send notifications to all inactive users when a new message is posted
exports.updateProfilePictureNewsfeedAndMarketplace = functions.firestore
  .document("Tenants/{tenantId}")
  .onUpdate(async (change) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();
    const {
      userProfileImage: newProfileImage,
      userID,
      lastName: newLastName,
      firstName: newFirstName,
    } = newValue;

    // ...or the previous value before this update
    const previousValue = change.before.data();
    const {
      userProfileImage: oldProfileImage,
      lastName: oldLastName,
      firstName: oldFirstName,
    } = previousValue;

    // update profile picture if it has changed
    if (newProfileImage !== oldProfileImage) {
      log("Tenant profile image changed, updating old posts...");
      await updateTenantProp(
        "Newsfeed",
        userID,
        { userProfileImage: newProfileImage },
        false
      );

      log("Updating comments profile image...");
      await updateTenantProp(
        "peopleWhoCommented",
        userID,
        { userProfileImage: newProfileImage },
        true
      );

      log("Updating old marketplace items profile image...");
      await updateTenantProp(
        "Marketplace",
        userID,
        { userProfileImage: newProfileImage },
        false
      );
    }

    // update last name if it has changed
    if (newLastName !== oldLastName) {
      log("Tenant last name changed, updating old posts...");
      await updateTenantProp(
        "Newsfeed",
        userID,
        { userLastName: newLastName },
        false
      );

      log("Updating comments last name...");
      await updateTenantProp(
        "peopleWhoCommented",
        userID,
        { lastName: newLastName },
        true
      );

      log("Updating old marketplace items last name...");
      await updateTenantProp(
        "Marketplace",
        userID,
        { userLastName: newLastName },
        false
      );
    }

    // update first name if it has changed
    if (newFirstName !== oldFirstName) {
      log("Tenant first name changed, updating old posts...");
      await updateTenantProp(
        "Newsfeed",
        userID,
        { userFirstName: newFirstName },
        false
      );

      log("Updating comments first name...");
      await updateTenantProp(
        "peopleWhoCommented",
        userID,
        { firstName: newFirstName },
        true
      );

      log("Updating old marketplace items first name...");
      await updateTenantProp(
        "Marketplace",
        userID,
        { userFirstName: newFirstName },
        false
      );
    }
  });

// Delete all messages after an amount of time
exports.scheduledFunctionDeleteAllMessages = functions.pubsub
  .schedule("1,15 of month 09:00")
  .onRun(async () => {
    console.log("This will be run every 15 days! Delete all messages");
    // delete all messages
    await admin
      .firestore()
      .collection("MessagingList")
      .get()
      .then((result) => {
        result.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .catch((error) => {
        log("Error deleting messages: ", error);
      });
    return null;
  });

const updateTenantProp = async (collection, userID, newProp, group) => {
  if (group) {
    await admin
      .firestore()
      .collectionGroup(collection)
      .where("userID", "==", userID)
      .get()
      .then((result) => {
        result.forEach((doc) => {
          const data = doc.data();
          doc.ref.update(newProp);
          log("updated new tenant prop collection group: ", data);
        });
      });
    return;
  }

  await admin
    .firestore()
    .collection(collection)
    .where("userID", "==", userID)
    .get()
    .then((result) => {
      result.forEach((doc) => {
        const data = doc.data();
        doc.ref.update(newProp);
        log("updated new tenant prop collection: ", data);
      });
    });
  return;
};

const createNotificationItemInFirestore = async (
  authorID,
  userID,
  postID,
  firstName,
  lastName,
  id,
  content
) => {
  const notificationItem = {
    id: id,
    content: content,
    postID: postID,
    authorID: authorID,
    userID: userID,
    wasSeen: false,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  log("notificationItem", notificationItem);
  await admin
    .firestore()
    .doc(`Tenants/${authorID}/Notifications/${id}`)
    .set(notificationItem)
    .then((result) => {
      log("Notification item added: ", result);
    })
    .catch((error) => {
      log("Error adding notification item: ", error);
    });
};

const deleteNotificationItemInFirestore = async (authorID, id) => {
  await admin
    .firestore()
    .collection(`Tenants/${authorID}/Notifications`)
    .doc(`${id}`)
    .delete()
    .then((result) => {
      log("Notification item deleted: ", result);
    })
    .catch((error) => {
      log("Error deleting notification item: ", error);
    });
};

const sendPushNotification = async (
  pushToken,
  senderName,
  content,
  data = {}
) => {
  const expo = new Expo();
  let messages = [];
  // for (let pushToken of pushTokenList) {
  // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }

  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  messages.push({
    to: pushToken,
    sound: "default",
    title: senderName, // Announcement, Notice, someone's name
    body: content, // content of the message, "liked your post", "commented on your post", etc.
    data: data,
  });
  // }
  log("messages: ", messages);

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
