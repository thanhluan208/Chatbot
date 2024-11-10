const baseAPI = "https://helped-dragon-entirely.ngrok-free.app"; 
// const baseAPI = "https://chatbot-api.alphiiai.com";
export const getFolderKnowledge =
  baseAPI + "/knowledge/list_knowledge_storages";
export const getListKnowledgeFile = baseAPI + "/knowledge/list_files";
export const createFolderKnowledge =
  baseAPI + "/knowledge/new_knowledge_storage";
export const uploadYoutube = baseAPI + "/knowledge/upload_youtube_url";
export const uploadFile = baseAPI + "/knowledge/upload_file";
export const deleteKnowledge = baseAPI + "/knowledge/delete_knowledge_storage";
export const uploadUrl = baseAPI + "/knowledge/upload_url";
export const deleteFile = baseAPI + "/knowledge/delete_file";
export const updateKnowledgeToBot =
  baseAPI + "/knowledge/update_knowledge_storages_to_bot";
export const removeKnowledgeFromBot =
  baseAPI + "/knowledge/drop_knowledge_storages_from_bot";
export const updateKnowledgePermission =
  baseAPI + "/knowledge/update_knowledge_storage_permission_to_user";
export const publishKnowledge = baseAPI + "/knowledge/update_on_store";
export const deleteFromStore = baseAPI + "/knowledge/delete_from_store";
export const getSegments = baseAPI + "/knowledge/get_file_segments";
export const getFileRaw = baseAPI + "/knowledge/get_file_url";
export const getFileData = baseAPI + "/knowledge/get_file_data"
export const retryUploadFile = baseAPI + '/knowledge/retry_upload'
export const getKnowledgeDetail = baseAPI + "/knowledge/get_knowledge_storage_data";

export const signInApi = baseAPI + "/user/validate_user";
export const signUpApi = baseAPI + "/user/create_user";
export const changePasswordApi = baseAPI + "/user/change_password_user";
export const getUserData = baseAPI + "/user/show_user_data";
export const searchUser = baseAPI + "/user/search_user";
export const updateUser = baseAPI + "/user/update_user";

export const getListBot = baseAPI + "/bot/show_all_bots_for_user";
export const createBot = baseAPI + "/bot/create_bot";
export const deleteBot = baseAPI + "/bot/delete_bot";
export const getBotData = baseAPI + "/bot/get_bot_data";
export const getBotsStore = baseAPI + "/bot/list_bots";
export const publishBot = baseAPI + "/bot/update_on_store";
export const chatBot = baseAPI + "/bot/chat_stream_completion";
export const removeBotFromStore = baseAPI + "/bot/delete_from_store";
export const updateBotModel = baseAPI + "/bot/change_model_for_bot";
export const updateBotParams = baseAPI + "/bot/update_model_params_for_bot";
export const botChatHistory = baseAPI + "/bot/get_all_chat_history";
export const getBotListConversation = baseAPI + "/bot/list_conversation";
export const newConversation = baseAPI + "/bot/new_conversation";
export const clearConversation = baseAPI + "/bot/clear_conversation";
export const deleteConversation = baseAPI + "/bot/delete_conversation";
export const createMultiAgent = baseAPI + "/bot/create_multi_agent";
export const updatePrompt = baseAPI + "/bot/update_system_prompt_to_bot";
export const changeBotMode = baseAPI + "/bot/change_bot_mode";
export const duplicateBot = baseAPI + "/bot/duplicate_bot";
export const changeCurrentNode = baseAPI + '/bot/change_current_node'

export const getBotNode = baseAPI + "/node/get_node_data";
export const deleteBotNode = baseAPI + "/node/delete_node";
export const createNode = baseAPI + "/node/create_node";
export const updateBotNode = baseAPI + "/node/update_info";
export const updateMetadata = baseAPI + "/node/update_node_metadata";
export const updateSystemPrompt =
  baseAPI + "/node/update_system_prompt_to_node";
export const updateBotEdge = baseAPI + "/node/add_edge";
export const removeEdge = baseAPI + "/node/remove_edge";
export const updateScenario = baseAPI + "/node/update_scenario_to_node";
export const updateNodeLLM = baseAPI + "/node/update_model_params_for_node";


export const createWorkflowAPI = baseAPI + "/workflow/create_workflow";
export const deleteWorkflowAPI = baseAPI + "/workflow/delete_workflow";
export const addNodeWorkflowAPI = baseAPI + "/workflow/add_node";
export const removeNodeWorkflowAPI = baseAPI + "/workflow/remove_node";
export const getWorkFlowsAPI = baseAPI + "/workflow/list_workflows";
export const getWorkflowDetailAPI = baseAPI + "/workflow/get_workflow_data";
export const updateWorkflowNodeData = baseAPI + "/workflow/update_node_data";
export const addEdgeWorkflowAPI = baseAPI + "/workflow/add_edge";
export const removeEdgeWorkflowAPI = baseAPI + "/workflow/remove_edge";
