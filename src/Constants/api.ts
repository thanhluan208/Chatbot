const baseAPI = localStorage.getItem('baseUrl') || "https://6a14-42-114-248-186.ngrok-free.app";

export const getFolderKnowledge = baseAPI + "/knowledge/list_knowledge_storages";
export const getListKnowledgeFile = baseAPI + "/knowledge/list_files";
export const createFolderKnowledge = baseAPI + "/knowledge/new_knowledge_storage";
export const uploadYoutube = baseAPI + "/knowledge/upload_youtube_url"
export const uploadFile = baseAPI + "/knowledge/upload_file";
export const deleteKnowledge = baseAPI + "/knowledge/delete_knowledge_storage";
export const uploadUrl = baseAPI + '/knowledge/upload_url'
export const deleteFile = baseAPI + "/knowledge/delete_file";
export const updateKnowledgeToBot = baseAPI + "/knowledge/update_knowledge_storages_to_bot"
export const removeKnowledgeFromBot = baseAPI + "/knowledge/drop_knowledge_storages_from_bot"
export const updateKnowledgePermission = baseAPI + "/knowledge/update_knowledge_storage_permission_to_user"

export const signInApi = baseAPI + "/user/validate_user";
export const signUpApi = baseAPI + "/user/create_user";
export const changePasswordApi = baseAPI + "/user/change_password_user";
export const getUserData = baseAPI + "/user/show_user_data";
export const searchUser = baseAPI + "/user/search_user"

export const getListBot = baseAPI + "/bot/show_all_bots_for_user";
export const createBot = baseAPI + "/bot/create_bot";
export const deleteBot = baseAPI + "/bot/delete_bot";
export const getBotData = baseAPI + "/bot/get_bot_data";


