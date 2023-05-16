import Peer from 'peerjs';
import { useRef, useEffect, useState } from 'react';

const VideoChat = ({ id }) => {
  const videoRef = useRef();
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    const peer = new Peer(id);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display the local video stream
        videoRef.current.srcObject = stream;

        // Connect to other users' video streams
        peer.on('connection', (conn) => {
          console.log("coming here")
          const call = peer.call(conn.peer, stream);

          call.on('stream', (remoteStream) => {
            console.log('Received remote stream:', remoteStream);
            setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
          });
        });

        // Answer incoming calls
        peer.on('call', (call) => {
          call.answer(stream);

          call.on('stream', (remoteStream) => {
            setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
          });
        });

        // Connect to other users' IDs
        peer.on('error', console.error);
      })
      .catch(console.error);
  }, [id]);
  console.log(remoteStreams)

  return (
    <>
      <video ref={videoRef} autoPlay muted />
      {
        
      
      remoteStreams.map((stream) => (
        <video key={stream.id} srcObject={stream} autoPlay />
      ))}
    </>
  );
};

export default VideoChat;
