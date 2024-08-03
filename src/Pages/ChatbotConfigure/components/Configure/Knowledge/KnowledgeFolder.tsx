import { Box } from "@mui/material";
import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ListRoutes } from "../../../../../Constants/routes";

export interface IKnowledgeFolder {
  title?: string;
  description?: string;
  size: string;
  quantity: string;
  createdAt: string;
}

const KnowledgeFolder = (props: IKnowledgeFolder) => {
  //! State
  const { title, description, size, quantity, createdAt } = props;
  const navigate = useNavigate();

  //! Function

  //! Render

  return (
    <Box
      onClick={() => {
        if (title) {
          navigate(ListRoutes.knowledgeDetail.replace(":knowledgeId", title));
        }
      }}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": {
          background: "#2e2f380d",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Box>
          <CommonIcons.Topic color="primary" sx={{ width: 36, height: 36 }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <CommonStyles.Typography type="bold14">
            {title || "Anonymous folder"}
          </CommonStyles.Typography>
          <CommonStyles.Typography type="normal14">
            {description || "--"}
          </CommonStyles.Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <CommonStyles.Chip label={size || "0 Byte"} />
            <CommonStyles.Chip label={`${quantity || 0} Data`} />
          </Box>
          <CommonStyles.Typography type="normal12" color="#1c1f2366">
            Creation time {createdAt || moment().format("DD/MM/YYYY HH:mm")}
          </CommonStyles.Typography>
        </Box>
      </Box>
      <Box>
        <CommonStyles.Button variant="outlined">Add</CommonStyles.Button>
      </Box>
    </Box>
  );
};

export default KnowledgeFolder;
