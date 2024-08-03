import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Home from "./Pages/Home";
import Users from "./Pages/Users";
import DefaultLayout from "./Components/DefaultLayout";
import { ListRoutes } from "./Constants/routes";
import ChatbotConfigure from "./Pages/ChatbotConfigure";
import Workflow from "./Pages/Workflow";
import KnowledgeDetail from "./Pages/KnowledgeDetail";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "./Providers/AuthenticationProvider";
import useRoutes from "./Constants/routes";

function App() {
  //! State
  const [baseUrl, setbaseUrl] = useState("");
  const { userId } = useAuth();
  const Routes = useRoutes();
  const router = createBrowserRouter([
    {
      element: <DefaultLayout />,
      children: [
        {
          // path: Routes.common.HOME.path,
          path: "*",
          element: <Home />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
        {
          path: Routes.common.PERSONAL.path,
          element: <Users />,
          loader: () => {
            if (!userId) return redirect("/login");

            return null;
          },
        },
      ],
    },
    {
      path: ListRoutes.workspace,
      element: <ChatbotConfigure />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: Routes.explore.WORKFLOW_STORE.path,
      element: <Workflow />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.knowledgeDetail,
      element: <KnowledgeDetail />,
      loader: () => {
        if (!userId) return redirect("/login");

        return null;
      },
    },
    {
      path: ListRoutes.login,
      element: <Login />,
      loader: () => {
        if (userId) return redirect("/");

        return null;
      },
    },
    {
      path: ListRoutes.signup,
      element: <SignUp />,
      loader: () => {
        if (userId) return redirect("/");

        return null;
      },
    },
  ]);

  //! Function


  //! Render
  return (
    <Fragment>
      <div style={{ position: "fixed", top: 0 }}>
        <input onChange={(e) => setbaseUrl(e.target.value)} />
        <button
          onClick={() => {
            localStorage.setItem("baseUrl", baseUrl);
          }}
        >
          submit
        </button>
      </div>
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
