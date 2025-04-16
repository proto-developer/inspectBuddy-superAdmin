import USER_DETAILS_ENDPOINTS from "../../../constants/api/userDetails";
import axiosInstance from "../../../utils/axiosInstance";

export const userPropertiesAPIs = {
  // Add New Property
  addNewProperty: async ({ formData, userId }) => {
    try {
      const response = await axiosInstance.post(
        USER_DETAILS_ENDPOINTS.ADD_NEW_USER_PROPERTY_URL({
          userId,
        }),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding new Property", error);
      throw new Error(
        error.response?.data?.message || "Error adding new Property"
      );
    }
  },
  // Add Property Category
  createPropertyCategory: async ({ value, iconId, userId }) => {
    try {
      const response = await axiosInstance.post(
        USER_DETAILS_ENDPOINTS.CREATE_NEW_PROPERTY_CATEGORY_URL({
          userId,
        }),
        { value, iconId }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding new Property Category", error);
      throw new Error(
        error.response?.data?.message || "Error adding new Property Category"
      );
    }
  },
  // Delete Property
  deleteUserProperty: async ({ propertyId, userId }) => {
    try {
      const response = await axiosInstance.delete(
        USER_DETAILS_ENDPOINTS.DELETE_USER_PROPERTY_URL({
          userId,
          propertyId,
        })
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting Property", error);
      throw new Error(
        error.response?.data?.message || "Error deleting Property"
      );
    }
  },

  // Fetch Next Pages of Related Inspections with a Property
  fetchRelatedInspectionsOfProperty: async ({ propertyId, page, limit }) => {
    try {
      const response = await axiosInstance.get(
        USER_DETAILS_ENDPOINTS.FETCH_LINKED_PROPERTY_INSPECTIONS_URL({
          propertyId,
          page,
          limit: limit,
        })
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching User Property Inspections", error);
      throw new Error(
        error.response?.data?.message ||
          "Error fetching User Property Inspections"
      );
    }
  },
};
