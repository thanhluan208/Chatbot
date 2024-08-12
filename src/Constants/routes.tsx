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
    },
    explore: {
      BOT_STORE: {
        path: "/bot-store",
        icon: <CommonIcons.SmartToy />,
      },
      PLUGIN_STORE: {
        path: "/plugin-store",
        icon: <CommonIcons.Extension />,
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
  knowledgeDetail: "/knowledge/:knowledgeId",
  knowledgeUpload: "/knowledge/:knowledgeId/upload",  
};

export default useRoutes;
