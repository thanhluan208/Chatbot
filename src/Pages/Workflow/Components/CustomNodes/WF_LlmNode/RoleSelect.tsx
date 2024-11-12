import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RoleSelectProps {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  handleSelectRole?: (value: string) => void;
}

const RoleSelect = ({ options, value, handleSelectRole }: RoleSelectProps) => {
  const theme = useTheme();

  const currentValue = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Box
          className="bg-transparent w-fit px-2 rounded-md py-1 cursor-pointer flex items-center gap-2"
          sx={{
            "&:hover": {
              background: theme.colors.custom.background,
            },
          }}
        >
          <CommonStyles.Typography type="semiBold12">
            {currentValue?.label?.toUpperCase()}
          </CommonStyles.Typography>
          <div>
            <ChevronUp size={8} />
            <ChevronDown size={8} />
          </div>
        </Box>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit z-[10000] hover:bg-transparent border-none"
        style={{
          background: theme.colors.custom.backgroundCard,
        }}
      >
        <DropdownMenuGroup className="hover:bg-transparent">
          {options.map((option) => {
            return (
              <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent p-0">
                <Box
                  className="px-2 py-1.5 w-full rounded-md"
                  key={option.value}
                  onClick={() =>
                    handleSelectRole && handleSelectRole(option.value)
                  }
                  sx={{
                    "&:hover": {
                      background: theme.colors.custom.background,
                    },
                    "&:focus": {
                      background: theme.colors.custom.background,
                    },
                  }}
                >
                  <CommonStyles.Typography>
                    {option.label}
                  </CommonStyles.Typography>
                </Box>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelect;
