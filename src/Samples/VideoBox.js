// import React,{useEffect,useState} from 'react';
// import {io} from "socket.io-client";
// import {useParams} from 'react-router-dom';
// import {Grid} from "@material-ui/core";
// import Peer from 'peerjs';
// var connectionOptions =  {
// "force new connection" : true,
// "reconnectionAttempts": "Infinity", 
// "timeout" : 10000,                  
// "transports" : ["websocket"]
// };
// const Videobox = ({isVideoMute,isAudioMute}) => {


// var myPeer = new Peer(
//   {
//     config: {'iceServers': [
//       {urls:'stun:stun01.sipphone.com'},
//       {urls:'stun:stun.ekiga.net'},
//       {urls:'stun:stun.fwdnet.net'},
//       {urls:'stun:stun.ideasip.com'},
//       {urls:'stun:stun.iptel.org'},
//       {urls:'stun:stun.rixtelecom.se'},
//       {urls:'stun:stun.schlund.de'},
//       {urls:'stun:stun.l.google.com:19302'},
//       {urls:'stun:stun1.l.google.com:19302'},
//       {urls:'stun:stun2.l.google.com:19302'},
//       {urls:'stun:stun3.l.google.com:19302'},
//       {urls:'stun:stun4.l.google.com:19302'},
//       {urls:'stun:stunserver.org'},
//       {urls:'stun:stun.softjoys.com'},
//       {urls:'stun:stun.voiparound.com'},
//       {urls:'stun:stun.voipbuster.com'},
//       {urls:'stun:stun.voipstunt.com'},
//       {urls:'stun:stun.voxgratia.org'},
//       {urls:'stun:stun.xten.com'},
//       {
//         urls: 'turn:numb.viagenie.ca',
//         credential: 'muazkh',
//         username: 'webrtc@live.com'
//       },
//       {
//         urls: 'turn:192.158.29.39:3478?transport=udp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//       },
//       {
//         urls: 'turn:192.158.29.39:3478?transport=tcp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//       }
//     ]} /* Sample servers, please use appropriate ones */
//   }
// );
// const peers = {}
// const [socket, setSocket] = useState()
// const {id:videoId} = useParams();
// const videoGrid = document.getElementById('video-grid')

// useEffect(()=> {
//     const s=io("https://weconnectbackend.herokuapp.com",connectionOptions);
//     setSocket(s);
//     return () => {
//       s.disconnect();
//     }
//   },[])

// // let myVideoStream;
// const [myVideoStream, setmyVideoStream] = useState()
// const muteUnmute = () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     //setUnmuteButton();
//   } else {
//     //setMuteButton();
//     myVideoStream.getAudioTracks()[0].enabled = true;
//   }
// }

// const playStop = () => {
//   //console.log('object')
//   let enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     //setPlayVideo()
//   } else {
//     //setStopVideo()
//     myVideoStream.getVideoTracks()[0].enabled = true;
//   }
// }
// useEffect(() => {
//   if(myVideoStream)
//     playStop()
// }, [isVideoMute])
// useEffect(() => {
//   if(myVideoStream)
//     muteUnmute()
// }, [isAudioMute])

// useEffect(() => {
    
//   if(socket== null)
//       return;
//   myPeer.on('open',id=>{
//     socket.emit('join-room',videoId,id);
//   })
//   const myVideo = document.createElement('video')
//   myVideo.muted = true
//   navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
//   }).then(stream => {
//     // myVideoStream = stream;
//     window.localStream=stream;
//     setmyVideoStream(stream);
//     console.log(myVideoStream,"myvideostream");
//     addVideoStream(myVideo, stream)
//     myPeer.on('call', call => {
//       call.answer(stream)
//       const video = document.createElement('video')
//       call.on('stream', userVideoStream => {
//         addVideoStream(video, userVideoStream)
//       })
//     })
  
//     socket.on('user-connected',userId =>{
//       connectToNewUser(userId, stream)
//     })

//     socket.on('user-disconnected', userId => {
//       if (peers[userId]) peers[userId].close()
//     })
//   })
  
// }, [socket,videoId])


// function addVideoStream(video, stream) {
//   video.srcObject = stream
//   video.addEventListener('loadedmetadata', () => {
//     video.play()
//   })
//   videoGrid.append(video)
// }

// function connectToNewUser(userId, stream) {
//   const call = myPeer.call(userId, stream)
//   const video = document.createElement('video')
  
//   call.on('stream', userVideoStream => {
//     addVideoStream(video, userVideoStream)
//   })
//   call.on('close', () => {
//     video.remove()
//   })

//   peers[userId] = call
// }

// return (

//     <div id="video-grid" className="videoStyleFromDiv">
//         <Video srcObject={srcObject}/>
//     </div>
  
// )
// }

// export default Videobox