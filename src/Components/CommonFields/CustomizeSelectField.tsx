import { Box, useTheme } from "@mui/material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CommonStyles from "../CommonStyles";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FieldProps } from "formik";
import { CommonOption } from "@/Types/common";
import React, { Fragment } from "react";
import { cn } from "@/lib/utils";

interface CustomizeSelectFieldProps {
  options: CommonOption[];
  initValue?: any;
  classNameMenuContent?: string;
  afterOnChange?: (value: string) => void;
  onChangeCustomize?: (value: string) => void;
  customizeOptions?: (
    option: any[],
    handleSelect: (value: string) => void,
    value?: string
  ) => React.ReactNode;
  fullWidth?: boolean;
  customizeValue?: (selectedOption: any) => React.ReactNode;
}

const CustomizeSelectField = ({
  options,
  classNameMenuContent,
  fullWidth,
  afterOnChange,
  onChangeCustomize,
  customizeOptions,
  field,
  form,
  customizeValue,
  initValue,
}: CustomizeSelectFieldProps & Partial<FieldProps>) => {
  const theme = useTheme();

  const { name, value } = field || {};
  const { setFieldValue } = form || {};

  const currentValue = options.find(
    (option) =>
      option.value === value ||
      option.value === value?.value ||
      option.value === initValue?.value ||
      option.value === initValue
  );

  const handleSelect = (value: string) => {
    if (onChangeCustomize) {
      onChangeCustomize(value);
      return;
    }

    setFieldValue && setFieldValue(name || "", value);

    afterOnChange && afterOnChange(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {customizeValue ? (
          customizeValue(currentValue as CommonOption)
        ) : (
          <Box
            className={cn(
              "bg-transparent px-2 rounded-md py-1 cursor-pointer flex items-center gap-2",
              fullWidth ? "w-full justify-between h-full" : " w-fit "
            )}
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
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-fit z-[10000] hover:bg-transparent border-none",
          classNameMenuContent
        )}
        style={{
          background: theme.colors.custom.backgroundCard,
        }}
      >
        <DropdownMenuGroup className="hover:bg-transparent">
          {customizeOptions ? (
            customizeOptions(options, handleSelect, currentValue?.value)
          ) : (
            <Fragment>
              {options.map((option) => {
                return (
                  <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent p-0">
                    <Box
                      className="px-2 py-1.5 w-full rounded-md"
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
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
            </Fragment>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomizeSelectField;
