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
import { memo, useEffect, useRef } from "react";

interface ModelStatsConfigProps {
  nodeId?: string;
  handleUpdateNodeData?: (nodeId: string, payload: any) => void;
  handleChange?: (payload: any) => void;
}

const ModelStatsConfig = ({
  nodeId,
  handleUpdateNodeData,
  handleChange,
}: ModelStatsConfigProps) => {
  const theme = useTheme();
  const { values, dirty } = useFormikContext<any>();
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (!dirty) return;

      const payload: any = {
        model: {
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
        memory: {
          history_turn: values.memory_history_turn,
        },
      };

      nodeId && handleUpdateNodeData && handleUpdateNodeData(nodeId, payload);
      handleChange && handleChange(payload);
    }, 500);
  }, [values, handleUpdateNodeData, nodeId, dirty]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-10 w-10 min-w-10 min-h-10 p-0 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            background: theme.colors.custom.background,
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
          zIndex: 100000000,
        }}
      >
        <Advance />
        <InputAndOutputSettings />
      </PopoverContent>
    </Popover>
  );
};

export default memo(ModelStatsConfig);
