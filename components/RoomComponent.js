import React from "react";


const RoomComponent = (props) => {
    const handleDisconnect = () => {
        socketInstance.current?.destoryConnection();
        props.history.push('/');
    }
    return (
        <React.Fragment>
            <div id="room-container"></div>
            <button onClick={handleDisconnect}>Disconnect</button>
        </React.Fragment>
    )
}

export default RoomComponent;