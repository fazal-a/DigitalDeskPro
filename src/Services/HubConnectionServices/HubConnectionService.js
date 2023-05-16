import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
// import { Toastr } from 'ngx-toastr';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { take } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { Member } from '../models/member';
// import { Message } from '../models/message';
// import { User } from '../models/user';
// import { MessageCountStreamService } from './message-count-stream.service';
// import { MuteCamMicService } from './mute-cam-mic.service';
import MessageCountStreamService from './messageCountService'; 



import Config from "../../Config"

const ChatHubService = (props) => {
  const hubUrl = Config.hubUrl;

  const [hubConnection, setHubConnection] = useState(null);
  const [messagesThread, setMessagesThread] = useState([]);
  const [oneOnlineUser, setOneOnlineUser] = useState({});
  const [oneOfflineUser, setOneOfflineUser] = useState({});
  



  useEffect(() => {
    if (props.user) {
      createHubConnection(props.userData, props.examId);
    }
    return () => {
      stopHubConnection();
    }
  }, [props.userData, props.examId]);

  const createHubConnection = (user, examId) => {
    console.log("here")

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl + 'chathub?examId=' + examId, {
        accessTokenFactory: () => user.token
      }).withAutomaticReconnect().build()

    connection.start().catch(err => console.log(err));
    setHubConnection(connection);

    connection.on('NewMessage', message => {
      if (MessageCountStreamService.activeTabChat) {
        MessageCountStreamService.MessageCount = 0;
      } else {
        MessageCountStreamService.MessageCount += 1
      }
      setMessagesThread([...messagesThread, message]);
    });
  }

  //   connection.on('UserOnlineInGroup', (user) => {
  //     setOneOnlineUser(user);
  //     props.toastr.success(user.displayName + ' has join examinee room!')
  //   });

  //   connection.on('UserOfflineInGroup', (user) => {
  //     setOneOfflineUser(user);
  //     props.toastr.warning(user.displayName + ' has left examinee room!')
  //   });

  //   connection.on('OnMuteMicro', ({ username, mute }) => {
  //     props.muteCamMicro.Microphone = { username, mute }
  //   });

  //   connection.on('OnMuteCamera', ({ username, mute }) => {
  //     props.muteCamMicro.Camera = { username, mute }
  //   });

  //   connection.on('OnShareScreen', (isShareScreen) => {
  //     props.muteCamMicro.ShareScreen = isShareScreen
  //   });

  //   connection.on('OnShareScreenLastUser', ({ usernameTo, isShare }) => {
  //     props.muteCamMicro.LastShareScreen = { username: usernameTo, isShare }
  //   });

  //   connection.on('OnUserIsSharing', currentUsername => {
  //     props.muteCamMicro.UserIsSharing = currentUsername
  //   });
  // };

  const stopHubConnection = () => {
    if (hubConnection) {
      hubConnection.stop().catch(error => console.log(error));
    }
  };

  // const sendMessage = async (content) => {
  //   return hubConnection.invoke('SendMessage', { content })
  //     .catch(error => console.log(error));
  // };

  // const muteMicroPhone = async (mute) => {
  //   return hubConnection.invoke('MuteMicro', mute)
  //     .catch(error => console.log(error));
  // };

  // const muteCamera = async (mute) => {
  //   return hubConnection.invoke('MuteCamera', mute)
  //     .catch(error => console.log(error));
  // }


};
export default ChatHubService;

















// import React, { useState, useEffect, useRef } from 'react';
// import { HubConnectionBuilder } from '@microsoft/signalr';

// import Config from "../../Config"

//   export const createHubConnection = (userData, examId) => {
//     const hubUrl = Config.hubUrl;
//     let messageCount;
//     const connection = new HubConnectionBuilder()
//       .withUrl(`${hubUrl}chathub?examId=${examId}`, {
//         accessTokenFactory: () => userData.token,
//       })
//       .withAutomaticReconnect()
//       .build();

//     connection
//       .start()
//       .then(() => console.log('Hub connection started!'))
//       .catch((err) => console.log(err));

//       connection.on('OnConnected', (connectionId) => {
//         console.log(`Connected with connectionId: ${connectionId}`);
//       });
  
//       connection.on('OnDisconnected', () => {
//         console.log('Disconnected from hub');
//       });

  