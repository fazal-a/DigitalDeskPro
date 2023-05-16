import Config from "../../Config";
const baseUrl = Config.apiUrl;

export const createRoom = async (roomName, token) => {
  try {
    const response = await fetch(`${baseUrl}Exam?name=${roomName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const roomData = await response.json();
    console.log("roomData", roomData);
    if (response.ok) {
      console.log(`Room ${roomData.examName} created`);
    } else {
      console.log("Failure in creating a room");
    }
  } catch (error) {
    console.log("Failure in creating room (Catch block)");
    console.error(error);
  }
};
