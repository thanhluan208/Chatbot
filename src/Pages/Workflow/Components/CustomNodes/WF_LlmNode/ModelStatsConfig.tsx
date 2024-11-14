import { SlidersHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import { useTheme } from "@mui/material";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { LlmNodeData } from "./type";

const ModelStatsConfig = () => {
  const theme = useTheme();
  const { values } = useFormikContext<any>();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirst = useRef(true);

  const { handleUpdateNodeDataLLM } = useWorkflowMutate();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }

      const payload: Partial<LlmNodeData> = {
        model: {
          ...values.nodeData.model,
          name: values.model.value,
          completion_params: {
            temperature: Number(values.temperature),
            top_p: Number(values.top_p),
            history_turn: Number(values.history_turn),
            max_tokens: Number(values.max_tokens),
            frequency_penalty: Number(values.frequency_penalty),
            presence_penalty: Number(values.presence_penalty),
          },
        },
      };

      handleUpdateNodeDataLLM(values.nodeId, values.nodeData, payload);

      isFirst.current = true
    }, 500);
  }, [values, handleUpdateNodeDataLLM]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-10 w-10 p-0 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SlidersHorizontal />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit"
        style={{
          background: theme.colors.custom.backgroundCard,
          borderColor: theme.colors.custom.borderColor,
          zIndex: 100000000
        }}
      >
        <Advance />
        <InputAndOutputSettings />
      </PopoverContent>
    </Popover>
  );
};

export default ModelStatsConfig;
