import Peer from 'peerjs';
import { useRef, useEffect } from 'react';

const VideoChat = ({ id }) => {
  const videoRef = useRef();

  useEffect(() => {
    const peer = new Peer(id);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display the local video stream
        videoRef.current.srcObject = stream;

        // Connect to other users' video streams
        peer.on('connection', (conn) => {
          conn.on('stream', (remoteStream) => {
            const video = document.createElement('video');
            video.srcObject = remoteStream;
            document.body.appendChild(video);
          });
        });

        // Connect to other users' IDs
        peer.on('error', console.error);
      })
      .catch(console.error);
  }, [id]);

  return <video ref={videoRef} autoPlay muted />;
};

export default VideoChat;
