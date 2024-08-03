const baseAPI =
  localStorage.getItem("baseUrl") || "https://cf44-118-70-86-53.ngrok-free.app";

export const getFolderKnowledge = baseAPI + "/knowledge/list_knowledges";
export const getListKnowledgeFile = baseAPI + "/knowledge/list_files";
export const createFolderKnowledge = baseAPI + "/knowledge/new_knowledge";

export const signInApi = baseAPI + "/user/validate_user";
export const signUpApi = baseAPI + "/user/create_user";
export const changePasswordApi = baseAPI + "/user/change_password_user"
export const getListBot = baseAPI + "/user/show_all_bots_for_user";
export const getUserData = baseAPI + "/user/show_user_data";

export const createBot = baseAPI + "/bot/create_bot";
export const deleteBot = baseAPI + "/bot/delete_bot";
export const getBotData = baseAPI + "/bot/get_bot_data"
