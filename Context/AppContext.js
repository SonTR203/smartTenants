import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebase-config";

const AppContext = createContext();

function AppProvider({ children }) {
  const [post, setPost] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [notifications, setNotifications] = useState({});
  const [unauthorizedUsers, setUnauthorizedUsers] = useState({});
  const [allUsers, setAllUsers] = useState({});
  const [buildings, setBuildings] = useState({});
  const [marketplaceBadges, setMarketplaceBadges] = useState({
    unseen: [],
    list: [],
  });
  const [notificationBadges, setNotificationBadges] = useState({
    unseen: [],
    list: [],
  });

  useEffect(() => {
    let unsubscribeMarketplace;
    if (currentUser && currentUser.userID) {
      // console.log("register for marketplace notifications");
      const marketplaceReference = collection(db, `MessagingList`);
      const marketplaceQuery = query(
        marketplaceReference,
        where("hasPeople", "array-contains", currentUser.userID)
      );
      unsubscribeMarketplace = onSnapshot(marketplaceQuery, (querySnapshot) => {
        const newMessages = [];
        const messagesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.lastMessage &&
            data.lastMessage.senderId !== currentUser.userID &&
            (!data.lastMessage.seen || data.isNew)
          ) {
            newMessages.push(data.id);
          }
          messagesList.push(data);
        });

        console.log("messagesList onSnapshot", messagesList.length);
        setMarketplaceBadges({
          unseen: newMessages,
          list: messagesList,
        });
      });

      return () => {
        if (unsubscribeMarketplace) {
          unsubscribeMarketplace();
        }
      };
    }
  }, [currentUser.userID]);

  useEffect(() => {
    let unsubscribeNotifications;
    if (currentUser && currentUser.userID) {
      const notificationRef = collection(
        db,
        `Tenants/${currentUser.userID}/Notifications`
      );
      unsubscribeNotifications = onSnapshot(
        notificationRef,
        (querySnapshot) => {
          const unseenNotifications = [];
          const list = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.wasSeen === false) {
              unseenNotifications.push(data.id);
            }
            list.push(data);
          });

          setNotificationBadges({
            unseen: unseenNotifications,
            list: list,
          });
        }
      );
    }

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [currentUser.userID]);

  return (
    <AppContext.Provider
      value={{
        post,
        setPost,
        currentUser,
        setCurrentUser,
        notifications,
        setNotifications,
        unauthorizedUsers,
        setUnauthorizedUsers,
        allUsers,
        setAllUsers,
        buildings,
        setBuildings,
        notificationBadges,
        setNotificationBadges,
        marketplaceBadges,
        setMarketplaceBadges,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within a AppProvider");
  return context;
}

export { useAppContext, AppProvider };
