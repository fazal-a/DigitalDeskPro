import * as signalR from "@microsoft/signalr";
const startConnection = (setConnection, setUsername, setMessage) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7040" + 'chathub?examId=' + 1).withAutomaticReconnect().build()

    connection.start().catch(err => console.log(err));


  connection.on("ReceiveMessage", (username, message) => {
    setMessage((prevMessages) => [...prevMessages, { username, message }]);
  });
  connection.on("UsersInRoom", (users) => {
    setUsername(users);
  });
  connection.start().then(() => {
    setConnection(connection);
  });
};
const joinRoom = (connection, username, roomName) => {
  connection.invoke("JoinRoom", username, roomName);
};
const leaveRoom = (connection, username, roomName) => {
  connection.invoke("LeaveRoom", username, roomName);
};
const sendMessage = (connection, username, roomName, message) => {
  connection.invoke("SendMessage", username, roomName, message);
};
export { startConnection, joinRoom, leaveRoom, sendMessage };
