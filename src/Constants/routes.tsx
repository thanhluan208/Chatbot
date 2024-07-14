import CommonIcons from "../Components/CommonIcons";

const Routes = {
  common: {
    HOME: {
      path: "/home",
      icon: <CommonIcons.Home />,
    },
    PERSONAL: {
      path: "/workspace/:id",
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

export const ListRoutes = {
  workspace: "/workspace/:id/bot/:botId",
};

export default Routes;
