import {
  Box,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "../CommonStyles";
import { FieldProps, getIn } from "formik";
import React, {  useId } from "react";

interface IMuiSelectField {
  onChangeCustomize?: (value: any) => void;
  afterOnChange?: (value: any) => void;
  options: any[];
  renderOption?: (options: any) => React.ReactNode;
  customRenderValue?: (value: any) => React.ReactNode;
  isReactFlow?: boolean;
  sxContainer?: SxProps;
}

function MuiSelectField(props: IMuiSelectField & SelectProps & FieldProps) {
  //! State
  const {
    field,
    form,
    options,
    renderOption,
    onChangeCustomize,
    afterOnChange,
    customRenderValue,
    isReactFlow,
    sxContainer,
    ...otherProps
  } = props;
  const id = useId();
  const theme = useTheme();
  const { errors, touched, setFieldValue } = form || {};
  const { name, value, onBlur } = field || {};

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";
  //! Function
  const handleChange = (value: any) => {
    if (onChangeCustomize) {
      onChangeCustomize(value);
    } else {
      setFieldValue(name, value);

      afterOnChange && afterOnChange(value);
    }
  };

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: otherProps.fullWidth ? "100%" : "fit-content",
        ".MuiInputBase-root": {
          padding: 0,
          display: "flex",
        },
        ".MuiSelect-select": {
          padding: "8px 16px",
        },
        ...sxContainer,
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
        onBlur={(e) => {
          onBlur(e);
        }}
        id={id}
        {...otherProps}
        error={!!errMsg}
        onOpen={() => {
          if (isReactFlow) {
            let count = 0;
            const interval = setInterval(() => {
              const paperElm = document.getElementById(`paper-${id}`);
              const selectElm = document.getElementById(id);
              if (count > 100) {
                clearInterval(interval);
              }
              if (paperElm && selectElm) {
                const rect = selectElm?.getBoundingClientRect();
                const { left, width } = rect;

                paperElm.style.left = `${left}px`;
                paperElm.style.minWidth = `${width}px`;
                paperElm.style.opacity = "1";

                clearInterval(interval);
              } else {
                count++;
              }
            }, 10);
          }
        }}
        label=""
        value={value || props.value}
        onChange={handleChange}
        sx={{
          padding: "8px 16px",

          div: {
            borderRadius: "10px",
            background: theme.colors.custom.backgroundCard,
          },

          fieldset: {
            borderRadius: "10px",
          },
        }}
        inputProps={{
          style: {},
        }}
        displayEmpty
        renderValue={(selectedValue) => {
          if (!selectedValue && !value) {
            return props.placeholder;
          }

          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            return options.find(
              (op) => op.value === selectedValue || op.value === value
            )?.label;
          }
        }}
        MenuProps={{
          slotProps: {
            paper: {
              id: `paper-${id}`,
              ...otherProps.MenuProps?.slotProps?.paper,
            },

          },
        }}
      >
        {options.map((op: { value: string; label: string; group?: string }) => {
          if (renderOption) {
            return renderOption(op);
          }
          return (
            <Box key={op?.value}>
              {op?.group && <ListSubheader>{op?.group}</ListSubheader>}
              <MenuItem
                value={op?.value}
                onClick={() => {
                  handleChange(op.value);
                }}
              >
                {op?.label}
              </MenuItem>
            </Box>
          );
        })}
      </Select>
    </Box>
  );
}

export default MuiSelectField;
