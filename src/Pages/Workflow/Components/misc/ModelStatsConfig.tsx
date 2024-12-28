import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import { useTheme } from "@mui/material";
import { SlidersHorizontal } from "lucide-react";
import { memo } from "react";


const ModelStatsConfig = () => {
  const theme = useTheme();

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
