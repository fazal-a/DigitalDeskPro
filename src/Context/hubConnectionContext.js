import React, { createContext, useState, useEffect, useContext } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Subject } from "rxjs";
import { take } from "rxjs";
import Config from "../Config";

const hubConnecionContext = createContext();

const HubConnectionProvider = ({ children }) => {

    // states variables 
  const [hubConnection, setHubConnection] = useState(null);
  const [activeTabChat, setActiveTabChat] = useState(false);

  // local variable
  const hubUrl = Config.hubUrl;
  let connection;

  // rxjs
  let messagesThreadSource = new Subject([]);
  let messagesThread$ = messagesThreadSource.asObservable();

  const createHubConnection = async (userData, examId, stream, messageCount, oneOnlineUserSource, addOtherUserVideo, myPeer) => {
    connection = new HubConnectionBuilder()
      .withUrl(hubUrl + "chathub?examId=" + examId, {
        accessTokenFactory: () => userData.token,
      })
      .withAutomaticReconnect()
      .build();
    setHubConnection(connection);
    await connection
      .start()
      .then(() => console.log("Hub connection started!"))
      .catch((err) => console.log("error from connection.start line:", err));

    connection.on("NewMessage", (message) => {
      
      if (activeTabChat) {
        messageCount = 0;
      } else {
        messageCount += 1;
      }
      messagesThread$.pipe(take(1)).subscribe((messages) => {
       
        messagesThreadSource.next([...messages, message]);
      }
      
      )
      console.log("here from connection.on NewMessage")
      ;
    });
    connection.on("UserOnlineInGroup", (user) => {
      oneOnlineUserSource.next(user);

      const call = myPeer.call(user.userName, stream, {
        metadata: {
          userId: {
            userName: userData.userName,
            displayName: userData.displayName,
          },
        },
      });
      if (call) {
        call.on("stream", (otherUserVideoStream) => {
          console.log("inside add suscription, member", user);
          console.log("otheruservideo", otherUserVideoStream);
          addOtherUserVideo(user, otherUserVideoStream);
        });

        call.on("close", () => {
        //   setVideosList((prevState) => {
        //     delete prevState[user.userName];
        //     return { ...prevState };
        //   });
        console.log('inside on close call from hubcxt')
        });
      }
    });
  };


  const stopHubConnection = () => {
    if (hubConnection) {
      hubConnection.stop().catch((error) => console.log(error));
    }
  };

  return (
    <hubConnecionContext.Provider value={{ createHubConnection, stopHubConnection }}>
      {children}
    </hubConnecionContext.Provider>
  );
};
const useHubConnection = () => useContext(hubConnecionContext);

export { HubConnectionProvider, useHubConnection };
