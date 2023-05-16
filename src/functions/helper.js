async function createLocalStream(videoRef, enableVideo, enableAudio) {
    let stream;
  
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: enableVideo,
        audio: enableAudio,
      });
  
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      console.log("stream Coming from createLocalStream function", stream);
    } catch (error) {
      console.error(error);
      alert(`Can't join room, error ${error}`);
    }
  
    return stream;
  }
  
  export { createLocalStream };
  