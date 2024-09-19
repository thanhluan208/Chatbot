import {
  Box,
  InputAdornment,
  TextField,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "..";
import { forwardRef, useEffect, useState } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

interface IInput {
  sxContainer?: {};
  fullWidth?: boolean;
  maxChar?: number;
  afterOnchange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  initValue?: string | number;
  onValueChange?: (value: string | number) => void;
}

const Input = forwardRef((props: IInput & TextFieldProps, ref: React.ForwardedRef<unknown>) => {
  //! State
  const {
    sxContainer,
    fullWidth,
    maxChar,
    afterOnchange,
    initValue,
    onValueChange,
    ...otherProps
  } = props;
  const [value, setValue] = useState(initValue ?? "");
  const save = useSave();

  const theme = useTheme();
  //! Function
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setValue(event.target.value);
    afterOnchange && afterOnchange(event);
  };

  useEffect(() => {
    onValueChange && onValueChange(value);
  }, [value]);
  
  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: fullWidth ? "100%" : "fit-content",
        ".MuiInputBase-root": {
          padding: 0,
          display: "flex",
          alignItems: otherProps?.multiline ? "end" : "center",
        },
        input: {
          "&:hover": {
            input: {
              background: theme.colors.custom.backgroundSecondary,
            },
          },
        },
        ...props.sxContainer,
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
      <TextField
        {...otherProps}
        value={value}
        label=""
        onChange={handleChange}
        onFocus={() => {
          save(cachedKeys.IS_EDITING, true);
        }}
        onBlur={() => {
          save(cachedKeys.IS_EDITING, false);
        }}
        sx={{
          div: {
            borderRadius: "10px",
            background: theme.colors.custom.backgroundSecondary,
          },

          fieldset: {
            borderRadius: "10px",
          },
          ...props.sx,
        }}
        inputProps={{
          style: {
            padding: otherProps.InputProps?.startAdornment
              ? "5px 16px 8px 0"
              : "8px 16px",
          },
        }}
        inputRef={ref}
        InputProps={{
          endAdornment: otherProps.InputProps?.endAdornment ? (
            otherProps.InputProps?.endAdornment
          ) : maxChar ? (
            <InputAdornment
              position="end"
              sx={{
                height: "100%",
                mr: "5px",
                mb: otherProps.multiline ? "5px" : 0,
                fontSize: "10px",
              }}
            >
              <CommonStyles.Typography type="normal12">
                {maxChar && `${value.toString()?.length || 0}/${maxChar}`}
              </CommonStyles.Typography>
            </InputAdornment>
          ) : null,
          ...otherProps.InputProps,
        }}
      />
    </Box>
  );
});

export default Input;
