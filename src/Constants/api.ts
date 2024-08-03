const baseAPI =
  localStorage.getItem("baseUrl") || "https://cf44-118-70-86-53.ngrok-free.app";

export const getFolderKnowledge = baseAPI + "/knowledge/list_knowledges";
export const getListKnowledgeFile = baseAPI + "/knowledge/list_files";
export const createFolderKnowledge = baseAPI + "/knowledge/new_knowledge";

export const signInApi = baseAPI + "/user/validate_user";
export const signUpApi = baseAPI + "//user/create_user";
