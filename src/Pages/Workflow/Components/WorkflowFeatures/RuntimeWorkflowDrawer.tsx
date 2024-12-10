import CommonStyles from "@/Components/CommonStyles";
import { DirectionAwareTabs } from "@/Components/ui/directionAwareTabs";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import { TvMinimalPlay, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import InputForm from "./InputForm";
import Result from "./Result";
import Tracing from "./Tracing";
import { SESSION_STORAGE_KEY } from "@/Constants/common";

interface RuntimeWorkflowDrawerProps {
  conversationId: string;
}

const RuntimeWorkflowDrawer = ({
  conversationId,
}: RuntimeWorkflowDrawerProps) => {
  const [isInputValid, setIsInputValid] = useState(false);

  const theme = useTheme();
  const save = useSave();

  const tabs = useMemo(() => {
    return [
      {
        id: 0,
        label: "input",
        content: (
          <InputForm
            conversationId={conversationId}
            setIsInputValid={setIsInputValid}
          />
        ),
      },
      {
        id: 1,
        label: "result",
        content: <Result />,
        disabled: !isInputValid,
      },
      {
        id: 2,
        label: "detail",
        content: <div></div>,
        disabled: !isInputValid,
      },
      {
        id: 3,
        label: "tracing",
        content: <Tracing />,
        disabled: !isInputValid,
      },
    ];
  }, [isInputValid, conversationId]);

  useEffect(() => {
    return () =>
      sessionStorage.removeItem(SESSION_STORAGE_KEY.WORKFLOW_RESULT_ANIMATED);
  }, []);

  return (
    <div
      className="py-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 h-10">
            <div
              className="w-6 h-6 flex items-center justify-center rounded-md"
              style={{
                background: theme.palette.primary.main,
              }}
            >
              <TvMinimalPlay className="w-3.5 h-3.5" color="#fff" />
            </div>
            <CommonStyles.Typography type="semiBold16">
              Runtime workflow
            </CommonStyles.Typography>
          </div>

          <CommonStyles.Button
            isIcon
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={() => {
              save(cachedKeys.NODE_EDITING, null);
            }}
          >
            <X size={24} />
          </CommonStyles.Button>
        </div>
      </div>

      <div className="">
        <DirectionAwareTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default RuntimeWorkflowDrawer;
