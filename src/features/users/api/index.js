import USERS_ENDPOINTS from "../../../constants/api/users";
import axiosInstance from "../../../utils/axiosInstance";

export const usersListAPIs = {
  getAllUsers: async ({ page, searchQuery, subscriptionPlan }) => {
    try {
      const response = await axiosInstance.get(
        USERS_ENDPOINTS.GET_ALL_USERS_URL({
          page,
          searchQuery,
          subscriptionPlan,
        })
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all Users", error);
      throw new Error(
        error.response?.data?.message || "Error fetching all Users"
      );
    }
  },
  generateUsersCSVFile: async () => {
    try {
      const response = await axiosInstance.get(
        USERS_ENDPOINTS.GENERATE_USERS_CSV_FILE_URL,
        {
          responseType: "blob",
        }
      );

      // Get the Blob from the response
      const blob = response.data;

      // Create a URL for the Blob object
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.xlsx";

      // Programmatically trigger a click event to download the file
      link.click();

      // Clean up by revoking the object URL and removing the link element
      link.remove();
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error generating Users CSV File", error);
      throw new Error(
        error.response?.data?.message || "Error generating Users CSV File"
      );
    }
  },
};
