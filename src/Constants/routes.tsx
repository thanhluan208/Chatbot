import CommonIcons from "../Components/CommonIcons";
import { useAuth } from "../Providers/AuthenticationProvider";

const useRoutes = () => {
  const { userId } = useAuth();

  return {
    common: {
      HOME: {
        path: "/",
        icon: <CommonIcons.Home />,
      },
      PERSONAL: {
        path: `/workspace/${userId}`,
        icon: <CommonIcons.Person />,
      },
      KNOWLEDGE_STORE: {
        path: "/knowledge-store",
        icon: <CommonIcons.Article />,
      },
      WORKFLOW_STORE: {
        path: ListRoutes.workflow,
        icon: <CommonIcons.Extension />,
      },
      TOOL_STORE: {
        path: ListRoutes.toolStore,
        icon: <CommonIcons.Extension />,
      },
    },
  };
};

export const ListRoutes = {
  login: "/login",
  signup: "/signup",
  botStore: "/bot-store",
  workspace: "/workspace/:id/bot/:botId",
  knowledgeDetail: "/workspace/:id/bot/:botId/knowledge/:knowledgeId",
  knowledgeDetailFromPersonal: "/workspace/:id/knowledge/:knowledgeId",
  knowledgeDetailFromStore: "/knowledge-store/:knowledgeId",
  knowledgeUpload: "/workspace/:id/bot/:botId/knowledge/:knowledgeId/upload",
  knowledgeStore: "/knowledge-store",
  userProfile: "/user/:userId",
  chatBot: "/bot-store/:botId",
  workflow: "/workflow",
  workflowDetail: (workflowId = ":workflowId") => `/workflow/${workflowId}`,
  publish: "/publish",
  verification: "/verification",
  toolStore: "/tool-store",
};

export default useRoutes;
