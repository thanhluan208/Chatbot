import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Users from "./Pages/Users";
import DefaultLayout from "./Components/DefaultLayout";
import Routes, { ListRoutes } from "./Constants/routes";
import ChatbotConfigure from "./Pages/ChatbotConfigure";
import Workflow from "./Pages/Workflow";

function App() {
  //! State
  const router = createBrowserRouter([
    {
      element: <DefaultLayout />,
      children: [
        {
          // path: Routes.common.HOME.path,
          path: "*",
          element: <Home />,
        },
        {
          path: Routes.common.PERSONAL.path,
          element: <Users />,
        },
      ],
    },
    {
      path: ListRoutes.workspace,

      element: <ChatbotConfigure />,
    },
    {
      path: Routes.explore.WORKFLOW_STORE.path,
      element: <Workflow />,
    },
  ]);

  //! Function

  //! Render
  return <RouterProvider router={router} />;
}

export default App;
