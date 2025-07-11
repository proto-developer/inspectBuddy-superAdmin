import USER_DETAILS_ENDPOINTS from "../../../constants/api/userDetails";
import axiosInstance from "../../../utils/axiosInstance";

export const userTemplatesAPIs = {
  // Create New Template
  createNewTemplate: async ({ templateName, userId }) => {
    try {
      const response = await axiosInstance.post(
        USER_DETAILS_ENDPOINTS.CREATE_NEW_TEMPLATE_URL({
          userId,
        }),
        {
          templateName: templateName,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating New Template", error);
      throw new Error(
        error.response?.data?.message || "Error creating New Template"
      );
    }
  },

  // Delete Template
  deleteTemplate: async ({ templateId, userId }) => {
    try {
      const response = await axiosInstance.delete(
        USER_DETAILS_ENDPOINTS.DELETE_USER_TEMPLATE_URL({
          templateId,
          userId,
        })
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Template", error);
      throw new Error(
        error.response?.data?.message || "Error deleting Template"
      );
    }
  },

  // Create New Question
  createNewQuestion: async ({
    templateId,
    roomId,
    elementId,
    questions,
    userId,
  }) => {
    try {
      const response = await axiosInstance.post(
        USER_DETAILS_ENDPOINTS.CREATE_NEW_QUESTION_IN_ELEMENT_URL({
          userId,
        }),
        {
          templateId,
          roomId,
          elementId,
          questions,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error adding Selected Questions to Room Element in Template",
        error
      );
      throw new Error(
        error.response?.data?.message ||
          "Error adding Selected Questions to Room Element in Template"
      );
    }
  },

  // Clone Template
  cloneTemplate: async ({ templateId, userId }) => {
    try {
      const response = await axiosInstance.post(
        USER_DETAILS_ENDPOINTS.CLONE_TEMPLATE_URL({
          userId,
        }),
        {
          templateId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cloning Template", error);
      throw new Error(
        error.response?.data?.message || "Error cloning Template"
      );
    }
  },

  // Delete Questions from a Room Element in a Template
  deleteQuestionsFromElement: async ({
    templateId,
    roomId,
    elementId,
    checklistItemIdArray,
  }) => {
    try {
      const response = await axiosInstance.patch(
        USER_DETAILS_ENDPOINTS.DELETE_QUESTIONS_FROM_ELEMENT_URL,
        {
          templateId,
          roomId,
          elementId,
          checklistItemIdArray,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting Selected Questions from Room Element in Template",
        error
      );

      throw new Error(
        error.response?.data?.message ||
          "Error deleting Selected Questions from Room Element in Template"
      );
    }
  },

  // Update Saved Question
  updateSavedQuestion: async ({
    userId,
    questionId,
    text,
    type,
    options,
    answerRequired,
  }) => {
    try {
      const response = await axiosInstance.patch(
        USER_DETAILS_ENDPOINTS.UPDATE_SAVED_QUESTION({ userId }),
        {
          questionId,
          text,
          type,
          options,
          answerRequired,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Saved Question", error);
      throw new Error(
        error.response?.data?.message || "Error updating Saved Question"
      );
    }
  },

  // Update Room Element Name in Inspection
  updateRoomElementNameInTemplate: async ({
    templateId,
    roomId,
    elementId,
    elementName,
  }) => {
    try {
      const response = await axiosInstance.patch(
        USER_DETAILS_ENDPOINTS.UPDATE_ROOM_ELEMENT_NAME_IN_TEMPLATE_URL,
        {
          templateId,
          roomId,
          elementId,
          elementName,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Room Element Name in Inspection", error);
      throw new Error(
        error.response?.data?.message ||
          "Error updating Room Element Name in Inspection"
      );
    }
  },

  // Update Specific Room in a Template
  updateSpecificRoomDetails: async ({ userId, templateId, roomData }) => {
    try {
      const response = await axiosInstance.patch(
        USER_DETAILS_ENDPOINTS.UPDATE_SPECIFIC_ROOM_IN_TEMPLATE_URL({
          userId,
        }),
        {
          templateId,
          roomData,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Specific Room in Template", error);
      throw new Error(
        error.response?.data?.message ||
          "Error updating Specific Room in Template"
      );
    }
  },

  // Delete Saved Question
  deleteSavedQuestion: async ({ userId, questionId }) => {
    try {
      const response = await axiosInstance.delete(
        USER_DETAILS_ENDPOINTS.DELETE_SAVED_QUESTION({ userId, questionId })
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Saved Question", error);
      throw new Error(
        error.response?.data?.message || "Error deleting Saved Question"
      );
    }
  },
};
