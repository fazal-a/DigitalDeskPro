import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Toastr } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { Message } from '../models/message';
import { User } from '../models/user';
import { MessageCountStreamService } from './message-count-stream.service';
import { MuteCamMicService } from './mute-cam-mic.service';

const ChatHubService = (props) => {

  const [hubConnection, setHubConnection] = useState(null);
  const [messagesThread, setMessagesThread] = useState([]);
  const [oneOnlineUser, setOneOnlineUser] = useState({});
  const [oneOfflineUser, setOneOfflineUser] = useState({});

  const hubUrl = environment.hubUrl;

  useEffect(() => {
    if (props.user) {
      createHubConnection(props.user, props.examId);
    }
    return () => {
      stopHubConnection();
    }
  }, [props.user, props.examId]);

  const createHubConnection = (user, examId) => {

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl + 'chathub?examId=' + examId, {
        accessTokenFactory: () => user.token
      }).withAutomaticReconnect().build()

    connection.start().catch(err => console.log(err));
    setHubConnection(connection);

    connection.on('NewMessage', message => {
      if (messageCountService.activeTabChat) {
        messageCountService.MessageCount = 0;
      } else {
        messageCountService.MessageCount += 1
      }
      setMessagesThread([...messagesThread, message]);
    });

    connection.on('UserOnlineInGroup', (user) => {
      setOneOnlineUser(user);
      props.toastr.success(user.displayName + ' has join examinee room!')
    });

    connection.on('UserOfflineInGroup', (user) => {
      setOneOfflineUser(user);
      props.toastr.warning(user.displayName + ' has left examinee room!')
    });

    connection.on('OnMuteMicro', ({ username, mute }) => {
      props.muteCamMicro.Microphone = { username, mute }
    });

    connection.on('OnMuteCamera', ({ username, mute }) => {
      props.muteCamMicro.Camera = { username, mute }
    });

    connection.on('OnShareScreen', (isShareScreen) => {
      props.muteCamMicro.ShareScreen = isShareScreen
    });

    connection.on('OnShareScreenLastUser', ({ usernameTo, isShare }) => {
      props.muteCamMicro.LastShareScreen = { username: usernameTo, isShare }
    });

    connection.on('OnUserIsSharing', currentUsername => {
      props.muteCamMicro.UserIsSharing = currentUsername
    });
  };

  const stopHubConnection = () => {
    if (hubConnection) {
      hubConnection.stop().catch(error => console.log(error));
    }
  };

  const sendMessage = async (content) => {
    return hubConnection.invoke('SendMessage', { content })
      .catch(error => console.log(error));
  };

  const muteMicroPhone = async (mute) => {
    return hubConnection.invoke('MuteMicro', mute)
      .catch(error => console.log(error));
  };

  const muteCamera = async (mute) => {
    return hubConnection.invoke('MuteCamera', mute)
      .catch(error => console.log(error));
  }

}
