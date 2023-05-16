import React, { useEffect, useRef, useState, useCallback } from "react";
import { useUserData } from "../../Context/UserDataContext";
import NavBar from "../../Utils/NavBar/NavBar";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Config from "../../Config";
import { ReplaySubject } from "rxjs";
import { Subject } from "rxjs";
import { take } from "rxjs";
import { Subscription } from "rxjs";


const Home = ({ location }) => {
  const { userData } = useUserData();
  const [videosList, setVideosList] = useState({});
  const [hubConnection, setHubConnection] = useState(null);
  const [plyrs, setPlyrs] = useState({});

  const state = location?.state;
  const callback = state?.callback;

  let videoRef = useRef(null);
  const enableVideo = true;
  const enableAudio = true;
  let myPeer;
  let stream;
  let videos = [];
  let connection;
  let messageCount = 0;

  let messageCountSource = new ReplaySubject(1);
  let messageCount$ = messageCountSource.asObservable();

  let activeTabChatSource = new ReplaySubject(1);
  let activeTabChat$ = activeTabChatSource.asObservable();

  let oneOnlineUserSource = new Subject();
  let oneOnlineUser$ = oneOnlineUserSource.asObservable();

  let oneOfflineUserSource = new Subject();
  let oneOfflineUser$ = oneOfflineUserSource.asObservable();

  let messagesThreadSource = new Subject([]);
  let messagesThread$ = messagesThreadSource.asObservable();

  let subscriptions = new Subscription();

  const [activeTabChat, setActiveTabChat] = useState(false);
  let { examId } = useParams();
  const hubUrl = Config.hubUrl;

  useEffect(() => {
    const init = async () => {
      try {
        await createLocalStream();
        await createHubConnection(userData, examId);

        myPeer = new Peer(userData.userName, {
          config: {
            iceServers: [
              {
                urls: "stun:stun.l.google.com:19302",
              },
              {
                urls: "turn:numb.viagenie.ca",
                username: "webrtc@live.com",
                credential: "muazkh",
              }],
          },
        });
        console.log("here from useEffect consoling myPeer:", myPeer);
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (otherUserVideoStream) => {
            addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
            console.log("here from myPeer.on call my own stream:", stream);
            console.log("here from myPeer.on call my own otherUserVideoStream:", otherUserVideoStream);

          });
          call.on("error", (err) => {
            console.log("error", err);
          });
        });
        const oneOnlineUserSubscription = oneOnlineUser$.subscribe((member) => {
          if (userData.userName !== member.userName) {
            setTimeout(() => {
              const call = myPeer.call(member.userName, stream, {
                metadata: {
                  userId: {
                    userName: userData.userName,
                    displayName: userData.displayName,
                  },
                },
              });
              if (call) {
                call.on("stream", (otherUserVideoStream) => {
                  addOtherUserVideo(member, otherUserVideoStream);
                });

                call.on("close", () => {
                  videos = videos.filter(
                    (video) => video.user.userName !== member.userName
                  );
                });
              }
            }, 1000);
          }
        });
        const messageCountSubscription = messageCount$.subscribe((value) => {
          messageCount = value;
        });

        if (oneOnlineUserSubscription) {
          subscriptions.add(oneOnlineUserSubscription);
        }

        if (messageCountSubscription) {
          subscriptions.add(messageCountSubscription);
        }
      } catch (error) {
        console.error(error);
        alert(`Can't join room, error ${error}`);
      }
    };

    init();
  
    return () => {
      stopHubConnection();
      subscriptions.unsubscribe();
    };
  }, [examId]);
  useEffect(() => {
    console.log("videosList:", videosList);
    Object.keys(videosList).forEach((key) => {
      if(videos[key]){
        videos[key].srcObject = videosList[key]?.srcObject;
      }
      
    console.log("srcObject:", videosList[key]?.srcObject);
    });
  }, [videosList]);

  useEffect(() => {
    if (callback) {
      callback();
    }
  }, []);

 const addOtherUserVideo = useCallback((user, stream) =>  {
    const tempVideo = {
      muted: false,
      srcObject: stream,
      user: user,
      videoRef: React.createRef(),
    };
    console.log("stream from addOtherUserVideo",stream )
    setVideosList((prevState) => ({
      ...prevState,
      [user.userName]: tempVideo,
    }));
  }, []);
  async function createLocalStream() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: enableVideo,
        audio: enableAudio,
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();
      console.log("stream Coming from createLocalStream function", stream)
    } catch (error) {
      console.error(error);
      alert(`Can't join room, error ${error}`);
    }
  }
  const createHubConnection = async (userData, examId) => {
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

          console.log("coming here in userOnlineinGroup close section videoList:", videosList)
          setVideosList((prevState) => {
            delete prevState[user.userName];
            return { ...prevState };
          });
        });
      }
    });

    connection.on('UserOfflineInGroup', (user) => {
      oneOfflineUserSource.next(user);
      setVideosList((prevState) => {
        return { ...prevState, };   
        
      });
      console.log('user has left the room')
    })

  };
  const stopHubConnection = () => {
    if (hubConnection) {
      hubConnection.stop().catch((error) => console.log(error));
    }
  };

  console.log("userData", userData);
  return (
    <>
      <NavBar />

      <h1 className="text-center ">{userData.roleName} </h1>
      <div className="d-flex justify-content-center my-5">
        <div className="card" style={{ width: "20rem" }}>
          <div className="card-img-top">
            <video
              ref={videoRef}
              muted
              autoPlay
              playsInline
              style={{ width: "100%" }}
            />
          </div>
          <div className="card-body">
            <p className="text-center">{userData.displayName}</p>
          </div>
        </div>
      </div>

      {userData.roleName === "Proctor" && videosList ? (
        <>
          <h3 className="text-center ">Examinees </h3>
          <hr />
          <div className="d-flex justify-content-center mx-5 flex-row">
            {Object.keys(videosList).map((key) => (
             
              <div
                key={key}
                className="card"
                style={{ width: "20rem", margin: "0.5rem" }}
              >
                
                <div className="card-img-top">
                  <video
                    key={key}
                    ref={(el) => (videos[key] = el)}
                    // ref={(el) => (videosList[key] = el)}
                    autoPlay
                    playsInline
                    controls
                    style={{ width: "100%" }}
                    srcobject={videosList[key].srcobject}
                  />
                </div>
                <div className="card-body">
                  <p className="text-center">
                    {videosList[key].user.displayName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
