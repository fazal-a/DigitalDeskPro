import Config from "../../Config";
const baseUrl = Config.apiUrl;

export const deleteRoom = async (roomId, token) => {
  try {
    const response = await fetch(`${baseUrl}Exam/${roomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const remainingRooms = await response.json();
    console.log("Deleted service: ", remainingRooms);
    if(response.ok) {
        return remainingRooms;
    }
  } catch (error) {
    console.log("Error in deleting room (Catch block)");
  }
};
