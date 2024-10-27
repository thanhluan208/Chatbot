import { Box } from "@mui/material";
import logo from "@/assets/logo.png";
import { useParams } from "react-router-dom";
import ChatWithBotButton from "./ChatWithBotButton";
import DeleteAgentButton from "./DeleteAgentButton";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";

interface WrapperNodeLabelProps {
  nodeId: string;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: {
    [key: string]: unknown;
  };
}

const WrapperNodeLabel = (props: WrapperNodeLabelProps) => {
  //! State
  const params = useParams();
  const botId = params?.botId;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          }}
        />
        <EditLabelNode {...props} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChatWithBotButton
          nodeId={props.nodeId}
          botId={botId || ""}
          data={props.data}
          isCurrentNode={!!props.data?.currentNode}
          positionAbsoluteX={props.positionAbsoluteX}
          positionAbsoluteY={props.positionAbsoluteY}
        />

        <DeleteAgentButton id={props.nodeId} />
      </Box>
    </Box>
  );
};

export default WrapperNodeLabel;
