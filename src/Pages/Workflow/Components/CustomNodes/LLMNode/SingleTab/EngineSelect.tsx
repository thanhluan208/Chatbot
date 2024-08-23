import {
  Box,
  Collapse,
  ListSubheader,
  MenuItem,
  Paper,
  Popper,
  SelectChangeEvent,
} from "@mui/material";
import React, { Fragment, memo, useId } from "react";
import { FastField, useFormikContext } from "formik";
import { ModelOption, modelOptions } from "../../../../../../Constants/options";
import CommonIcons from "../../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../../Components/CommonStyles";
import CommonField from "../../../../../../Components/CommonFields";

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
  const { values, setFieldValue } = useFormikContext<any>();
  const id = useId();

  const isSelected = values?.llm?.value === option?.value;

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
          setFieldValue("llm", option);
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
  const [open, setOpen] = React.useState(true);

  //! Function
  const renderOption = (option: ModelOption) => {
    return <EngineOption option={option} key={option.value} />;
  };

  const customRenderValue = (value: ModelOption) => {
    return <EngineOption option={value} isValue />;
  };

  const onChangeCustomize = (event: SelectChangeEvent<string>) => {
    setFieldValue("llm", JSON.parse(event?.target?.value));
  };

  //! Render
  return (
    <Box
      className="nodrag"
      sx={{
        "& .MuiSelect-select": {
          py: "2px",
          pl: "0",
        },
        marginTop: "20px",
        padding: "8px",
        background: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          cursor: "pointer",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <CommonStyles.Button isIcon onClick={() => setOpen((prev) => !prev)}>
          <CommonIcons.ExpandMore
            sx={{
              transform: !open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </CommonStyles.Button>
        <CommonStyles.Typography type="semiBold16">
          Model
        </CommonStyles.Typography>
      </Box>
      <Collapse in={open}>
        <FastField
          name="llm"
          component={CommonField.MuiSelectField}
          fullWidth
          options={modelOptions}
          renderOption={renderOption}
          onChangeCustomize={onChangeCustomize}
          required
          customRenderValue={customRenderValue}
          isReactFlow
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  borderRadius: "12px",
                  marginTop: "5px",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
              },
            },
          }}
        />
      </Collapse>
    </Box>
  );
};

export default memo(EngineSelect);
