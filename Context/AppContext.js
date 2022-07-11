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
  const [newPrivateMessages, setNewPrivateMessages] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (currentUser && currentUser.userID) {
      console.log("register for notifications");
      const colReference = collection(db, `MessagingList`);
      const q = query(
        colReference,
        where("hasPeople", "array-contains", currentUser.userID)
      );
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const latestMsgs = [];
        querySnapshot.forEach((doc) => {
          latestMsgs.push(doc.data());
        });
        // console.log("latestMsgs", latestMsgs.length);
        if (latestMsgs.length > 0) {
          const [lastItem] = latestMsgs.slice(-1);
          // console.log("newest message", lastItem);
          // if you receive a NEW message, update UI to alert user
          if (
            (lastItem &&
              lastItem.lastMessage &&
              lastItem.lastMessage.senderId !== currentUser.userID &&
              !lastItem.lastMessage.seen) ||
            lastItem.isNew
          ) {
            // alert("You have a new activity in Marketplace chat!");
            setNewPrivateMessages([...newPrivateMessages, lastItem.id]);
          }
        }
        // add code to update UI to alert user of new message
        // setMessagesList([...latestMsgs]);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

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
        newPrivateMessages,
        setNewPrivateMessages,
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
