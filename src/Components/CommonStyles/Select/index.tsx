import {
  Box,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "..";

interface ISelect {
  options: any[];
  value?: any;
  renderOption?: (options: any) => React.ReactNode;
  customRenderValue?: (value: any) => React.ReactNode;
  handleChange?: (value: any) => void;
}

const CommonSelect = (props: ISelect & SelectProps) => {
  //! State
  const {
    options,
    renderOption,
    customRenderValue,
    handleChange,
    value,
    sx,
    ...otherProps
  } = props;

  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: otherProps.fullWidth ? "100%" : "fit-content",
        padding: "1px",
        ".MuiInputBase-root": {
          padding: 0,
          display: "flex",
        },
        ".MuiSelect-select": {
          padding: "8px 16px",
        },
      }}
    >
      {otherProps?.label && (
        <CommonStyles.Typography type="bold14" my={1}>
          {otherProps?.label}
          {otherProps?.required && (
            <span
              style={{
                color: theme.colors.custom.colorErrorTypo,
                marginLeft: "4px",
              }}
            >
              *
            </span>
          )}
        </CommonStyles.Typography>
      )}
      <Select
        label=""
        value={value}
        sx={{
          padding: "8px 16px",

          div: {
            borderRadius: "10px",
            background: theme.colors.custom.backgroundCard,
          },

          fieldset: {
            borderRadius: "10px",
          },
          ...sx,
        }}
        inputProps={{
          style: {},
        }}
        renderValue={(selectedValue) => {
          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            return options.find((op) => op.value === selectedValue)?.label;
          }
        }}
        {...otherProps}
      >
        {options.map((op: { value: string; label: string; group?: string }) => {
          if (renderOption) {
            return renderOption(op);
          }
          return (
            <div key={op?.value}>
              {op?.group && <ListSubheader>{op?.group}</ListSubheader>}
              <MenuItem
                value={op?.value}
                onClick={() => {
                  handleChange && handleChange(op.value);
                }}
              >
                {op?.label}
              </MenuItem>
            </div>
          );
        })}
      </Select>
    </Box>
  );
};

export default CommonSelect;
