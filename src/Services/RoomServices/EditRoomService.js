import Config from "../../Config";
const baseUrl = Config.apiUrl;

export const editRoom = async (roomId, name, token) => {
  try {
    const response = await fetch(`${baseUrl}Exam?id=${roomId}&editName=${name}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const editRoom = await response.json();
    console.log("Edited service: ", editRoom);
    if(response.ok) {
        return editRoom;
    }
  } catch (error) {
    console.log("Error in deleting room (Catch block)");
  }
};
