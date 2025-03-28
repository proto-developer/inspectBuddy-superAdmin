import USER_DETAILS_ENDPOINTS from "../../../constants/api/userDetails";
import axiosInstance from "../../../utils/axiosInstance";

export const userTemplatesAPIs = {
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
};
