import {
  Box,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "../CommonStyles";
import { FieldProps, getIn } from "formik";
import React, { Fragment } from "react";

interface IMuiSelectField {
  onChangeCustomize: (value: any) => void;
  afterOnChange: (value: any) => void;
  options: any[];
  renderOption: (options: any) => React.ReactNode;
  customRenderValue: (value: any) => React.ReactNode;
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
    ...otherProps
  } = props;
  const theme = useTheme();
  const { errors, touched, setFieldValue } = form;
  const { name, value, onBlur } = field;

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
        {...otherProps}
        error={!!errMsg}
        label=""
        value={value}
        onChange={handleChange}
        sx={{
          padding: "8px 16px",

          div: {
            borderRadius: "10px",
            background: "#fff",
          },

          fieldset: {
            borderRadius: "10px",
          },
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
        // input={<BootstrapInput />}
      >
        {options.map((op: { value: string; label: string; group?: string }) => {
          if (renderOption) {
            return renderOption(op);
          }
          return (
            <Fragment>
              {op?.group && <ListSubheader>{op?.group}</ListSubheader>}
              <MenuItem
                value={op?.value}
                key={op?.value}
                onClick={() => {
                  handleChange(op.value);
                }}
              >
                {op?.label}
              </MenuItem>
            </Fragment>
          );
        })}
      </Select>
    </Box>
  );
}

export default MuiSelectField;
