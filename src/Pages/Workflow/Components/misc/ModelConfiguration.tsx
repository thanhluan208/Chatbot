import CustomizeSelectField from "@/Components/CommonFields/CustomizeSelectField";
import CommonStyles from "@/Components/CommonStyles";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { modelOptions } from "@/Constants/options";
import { Box, useTheme } from "@mui/material";
import { Field } from "formik";
import { Check } from "lucide-react";
import { Fragment, memo } from "react";
import { ModelOption } from "../CustomNodes/WF_LlmNode/type";

interface ModelConfigurationProps {
  afterOnChange?: (value: string) => void;
  onChangeCustomize?: (value: string) => void;
}

const ModelConfiguration = ({ afterOnChange,onChangeCustomize }: ModelConfigurationProps) => {
  const theme = useTheme();

  const customizeOptions = (
    options: ModelOption[],
    handleSelect: (value: string) => void,
    value?: any
  ) => {
    return options.map((option, index) => {
      const isSelected =
        option.value === value || option.value === value?.value;

      return (
        <Fragment key={option.value}>
          {index > 0 && !!option.group && (
            <hr className="border-t border-gray-300 my-1" />
          )}
          {option.group && (
            <CommonStyles.Typography
              sx={{
                marginLeft: "8px",
                marginTop: "12px",
                opacity: 0.5,
              }}
              type="semiBold16"
            >
              {option.group}
            </CommonStyles.Typography>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(option.value);
            }}
            className="hover:bg-transparent focus:bg-transparent p-0 my-1.5"
          >
            <Box
              className="px-2 py-1.5 w-full rounded-md flex items-center"
              key={option.value}
              sx={{
                "&:hover": {
                  background: theme.colors.custom.background,
                },
                "&:focus": {
                  background: theme.colors.custom.background,
                },
              }}
            >
              <Box sx={{ width: 16, height: 16, marginRight: "8px" }}>
                {isSelected && (
                  <Check
                    size={16}
                    color={theme.colors.custom.normalColorTypo}
                  />
                )}
              </Box>
              <img
                loading="lazy"
                width={16}
                height={16}
                style={{ borderRadius: "12px" }}
                src={`${option.img}`}
                alt=""
              />
              <CommonStyles.Typography type="bold14" mx={2}>
                {option.label}
              </CommonStyles.Typography>
            </Box>
          </DropdownMenuItem>
        </Fragment>
      );
    });
  };

  const customizeValue = (currentValue: ModelOption) => {

    console.log(currentValue)
    return (
      <button
        className="px-3 py-1.5 rounded-md flex items-center w-full cursor-pointer"
        style={{
          background: theme.colors.custom.backgroundCard,
          border: `1px solid ${theme.colors.custom.borderColor}`,
        }}
      >
        <img
          loading="lazy"
          width={16}
          height={16}
          style={{ borderRadius: "12px" }}
          src={`${currentValue?.img}`}
          alt=""
        />
        <CommonStyles.Typography type="bold14" mx={2}>
          {currentValue.label}
        </CommonStyles.Typography>
      </button>
    );
  };

  return (
    <Field
      name="model"
      component={CustomizeSelectField}
      options={modelOptions}
      customizeOptions={customizeOptions}
      classNameMenuContent="w-[400px]"
      customizeValue={customizeValue}
      afterOnChange={afterOnChange}
      onChangeCustomize={onChangeCustomize}
    />
  );
};

export default memo(ModelConfiguration);
