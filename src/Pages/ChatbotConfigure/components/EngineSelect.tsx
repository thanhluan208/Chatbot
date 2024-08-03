import {
  Box,
  ListSubheader,
  MenuItem,
  Paper,
  Popper,
  SelectChangeEvent,
} from "@mui/material";
import React, { Fragment, useId } from "react";
import CommonStyles from "../../../Components/CommonStyles";
import { ModelOption, modelOptions } from "../../../Constants/options";
import { FastField, useFormikContext } from "formik";
import CommonField from "../../../Components/CommonFields";
import CommonIcons from "../../../Components/CommonIcons";
import { initialValueEngine } from "./EngineButton";

const EngineOption = ({
  option,
  isValue,
}: {
  option: ModelOption;
  isValue?: boolean;
}) => {
  //! State
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { values, setFieldValue } = useFormikContext<initialValueEngine>();
  const id = useId();

  const isSelected = values?.model?.value === option?.value;

  const open = Boolean(anchorEl);

  //! Function

  //! Render
  return (
    <Fragment>
      {option?.group && !isValue && (
        <ListSubheader>{option.group}</ListSubheader>
      )}
      <MenuItem
        value={JSON.stringify(option)}
        key={option.value}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: isValue ? "0 12px 0 16px" : "12px 16px",
        }}
        onClick={() => {
          setFieldValue("model", option);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "transparent !important",
          }}
        >
          {!isValue && (
            <Box sx={{ width: 16, height: 16, marginRight: "8px" }}>
              {isSelected && (
                <CommonIcons.CheckOutlined sx={{ width: 16, height: 16 }} />
              )}
            </Box>
          )}

          <img
            loading="lazy"
            width={16}
            height={16}
            style={{ borderRadius: "12px" }}
            src={`${option.avatar}`}
            alt=""
          />
          <CommonStyles.Typography type="bold14" mx={2}>
            {option.label}
          </CommonStyles.Typography>
          <CommonStyles.Chip label={option.tag} />
        </Box>
        <Box
          sx={{
            background: "transparent !important",
          }}
          onMouseLeave={() => setAnchorEl(null)}
        >
          <CommonStyles.Button
            isIcon
            onMouseEnter={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            <CommonIcons.InfoOutlined sx={{ height: 16, width: 16 }} />
          </CommonStyles.Button>
          <Popper
            open={open}
            id={id}
            anchorEl={anchorEl}
            sx={{
              borderRadius: "12px",
              zIndex: 9999,
            }}
            //   onClose={()}
          >
            <Paper
              sx={{
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                width: "224px",
                gap: "8px",
                "& button": {
                  justifyContent: "start",
                },
              }}
            >
              <CommonStyles.Typography type="semiBold14">
                Feature Highlight:
              </CommonStyles.Typography>
              <ul
                style={{
                  paddingLeft: "20px",
                }}
              >
                <li>
                  <CommonStyles.Typography>
                    Support for Function calling (providing more accurate and
                    stable tool invocation capabilities)
                  </CommonStyles.Typography>
                </li>
                <li style={{ marginTop: "12px" }}>
                  <CommonStyles.Typography>
                    Input length support up to 204800 Tokens (approximately
                    307200 Chinese characters)
                  </CommonStyles.Typography>
                </li>
              </ul>
            </Paper>
          </Popper>
        </Box>
      </MenuItem>
    </Fragment>
  );
};

const EngineSelect = () => {
  //! State
  const { setFieldValue } = useFormikContext();

  //! Function
  const renderOption = (option: ModelOption) => {
    return <EngineOption option={option} />;
  };

  const customRenderValue = (value: ModelOption) => {
    return <EngineOption option={value} isValue />;
  };

  const onChangeCustomize = (event: SelectChangeEvent<string>) => {
    setFieldValue("model", JSON.parse(event?.target?.value));
  };

  //! Render
  return (
    <Box
      sx={{
        "& .MuiSelect-select": {
          py: "2px",
          pl: "0",
        },
      }}
    >
      <CommonStyles.Typography type="semiBold16" mb={"12px"}>
        Model
      </CommonStyles.Typography>
      <FastField
        name="model"
        component={CommonField.MuiSelectField}
        fullWidth
        options={modelOptions}
        renderOption={renderOption}
        onChangeCustomize={onChangeCustomize}
        required
        customRenderValue={customRenderValue}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                borderRadius: "12px",
                marginTop: "5px",
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default EngineSelect;
