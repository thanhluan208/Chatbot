import CommonIcons from "../Components/CommonIcons";
import { useAuth } from "../Providers/AuthenticationProvider";

const useRoutes = () => {
  const { userId } = useAuth();

  return {
    common: {
      HOME: {
        path: "/home",
        icon: <CommonIcons.Home />,
      },
      PERSONAL: {
        path: `/workspace/${userId}`,
        icon: <CommonIcons.Person />,
      },
      PLUGIN_STORE: {
        path: "/knowledge-store",
        icon: <CommonIcons.Article />,
      },
      WORKFLOW_STORE: {
        path: "/workflow-store",
        icon: <CommonIcons.Extension />,
      },
    },
    
  };
};

export const ListRoutes = {
  login: "/login",
  signup: "/signup",
  workspace: "/workspace/:id/bot/:botId",
  knowledgeDetail: "/workspace/:id/bot/:botId/knowledge/:knowledgeId",
  knowledgeUpload: "/workspace/:id/bot/:botId/knowledge/:knowledgeId/upload",
  knowledgeStore: "/knowledge-store",
  userProfile: "/user/:userId",
};

export default useRoutes;
