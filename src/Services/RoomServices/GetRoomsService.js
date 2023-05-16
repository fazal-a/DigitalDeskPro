import Config from "../../Config";
const baseUrl = Config.apiUrl;

export const getRooms = async (token, pageNumber) => {
  try {
    const response = await fetch(`${baseUrl}Exam?pageNumber=${pageNumber}&pageSize=100`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const allRooms = await response.json();
    if (response.ok) {

      return allRooms;
    } else {
      console.log("Failure in getting rooms");
      return null;
    }
  } catch (error) {
    console.log("Failure in getting rooms (Catch block)");
    console.error(error);
  }
};
