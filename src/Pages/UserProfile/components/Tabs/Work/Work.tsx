import { Box } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../../Components/CommonStyles";
import { useLocation, useNavigate } from "react-router-dom";
import { UserProfileTab } from "../../..";
import WorkCard from "./WorkCard";
import { mockDescription } from "../../../../../Helpers";
import Masonry from "@mui/lab/Masonry";

enum WorkTab {
  Bots = "Bots",
  Plugins = "Plugins",
  Workflows = "Workflows",
}

const Work = () => {
  //! State
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const subTabQuery = queryParams.get("subTab");
  const tabQuery = queryParams.get("tab");

  //! Function

  //! Render
  return (
    <Fragment>
      <Box sx={{ display: "flex", gap: "8px" }}>
        {Object.values(WorkTab).map((workTab) => {
          const isActive =
            subTabQuery === workTab ||
            (!subTabQuery && workTab === WorkTab.Bots);
          return (
            <CommonStyles.Button
              onClick={() => {
                navigate(
                  `?tab=${tabQuery ?? UserProfileTab.Work}&subTab=${workTab}`
                );
              }}
              sx={{
                background: isActive ? "#4e40e538" : "transparent",
              }}
            >
              <CommonStyles.Typography type="semiBold14">
                {workTab}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}
      </Box>

      <Box sx={{ marginTop: "20px", overflow:'hidden' }}>
        <Masonry columns={3} spacing={2}>
          {Array.from({ length: 10 }).map((_, index) => {
            return (
              <WorkCard
                key={index}
                avatar="https://p16-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/2b7506f1031c4ecc9a828bde1391285b~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727600185&x-signature=FnSjQncrVRzg9K27GlHn5GJonVI%3D"
                collect={Math.floor(Math.random() * 20)}
                creator={{
                  name: "@luandang123",
                }}
                description={mockDescription()}
                name="Bot Name"
                space={{
                  name: "Space Name",
                  avatar:
                    "https://sf16-passport-sg.ibytedtos.com/img/user-avatar-alisg/4d26373f2eedfe14710becde336c2450~300x300.image",
                }}
                users={Math.floor(Math.random() * 100)}
                category={["Category 1", "Category 2"]}
              />
            );
          })}
        </Masonry>
      </Box>
    </Fragment>
  );
};

export default Work;
