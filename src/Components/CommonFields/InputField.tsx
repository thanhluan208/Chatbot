import {
  Box,
  InputAdornment,
  TextField,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import { FieldProps, getIn } from "formik";
import { useCallback, useState } from "react";
import CommonStyles from "../CommonStyles";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

interface IInputField {
  onChangeCustomize: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  afterOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  maxChar: number;
  sxContainer?: {};
  customOnClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setShouldMaxRow: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

function InputField(props: IInputField & FieldProps & TextFieldProps) {
  //! Stat
  const {
    field,
    form,
    afterOnChange,
    onChangeCustomize,
    maxChar,
    ...otherProps
  } = props;
  const theme = useTheme();
  const save = useSave()
  const { setFieldValue, errors, touched } = form;
  const { name, value, onBlur } = field;

  const [shouldMaxRow, setShouldMaxRow] = useState(true);

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";

  //! Function
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChangeCustomize) {
        onChangeCustomize(event);
        return;
      } else {
        if (maxChar && event?.target?.value?.length >= maxChar) {
          setFieldValue(name, event.target.value.substring(0, maxChar));
          return;
        }

        setFieldValue(name, event.target.value);

        afterOnChange && afterOnChange(event);
      }
    },
    [onChangeCustomize, afterOnChange, maxChar, value]
  );

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
          alignItems: otherProps?.multiline ? "end" : "center",
        },
        input: {
          "&:hover": {
            input: {
              background: `${theme.colors.custom.backgroundSecondary}`,
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
        name={name}
        value={value}
        onBlur={(e) => {
          onBlur(e);
          setShouldMaxRow(true);
          save(cachedKeys.IS_EDITING, false);
        }}
        onFocus={() => {
          setShouldMaxRow(false);
          save(cachedKeys.IS_EDITING, true);
        }}
        {...otherProps}
        maxRows={
          shouldMaxRow && otherProps.maxRows ? otherProps.maxRows : undefined
        }
        error={errMsg}
        helperText={errMsg}
        label=""
        onChange={handleChange}
        sx={{
          div: {
            borderRadius: "10px",
            background: theme.colors.custom.backgroundSecondary,
          },
          textarea: {
            display: !shouldMaxRow ? undefined : "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "all .5s",
          },
          fieldset: {
            borderRadius: "10px",
          },
          ...props.sx,
        }}
        inputProps={{
          style: {
            padding: "8px 16px",
          },
        }}
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
                {maxChar && `${value?.length || 0}/${maxChar}`}
              </CommonStyles.Typography>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}

export default InputField;
