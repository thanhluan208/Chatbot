import { Box } from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import Hint from "./Hint";
import { FastField, useFormikContext } from "formik";
import CommonField from "../../../../../Components/CommonFields";
import CustomAdornment from "./CustomAdornment";
import { memo, useMemo } from "react";

interface ISlideAndNumField {
  hintContent: React.ReactNode;
  title: string;
  min: number;
  max: number;
  name: string;
  step?: number;
}

const SlideAndNumField = (props: ISlideAndNumField) => {
  //! State
  const { hintContent,  max, min, name, title, step } = props;
  const { setFieldValue } = useFormikContext();

  const marks = useMemo(() => {
    return [
      {
        value: min,
        label: min.toString(),
      },
      {
        value: max,
        label: max.toString(),
      },
    ];
  }, [min, max]);

  //! Function
  const handleChangeAdvance = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
    min: number,
    max: number
  ) => {
    const value = parseFloat(event.target.value);
    if ((value >= min && value <= max) || !value) {
      setFieldValue(name, value);
    }
  };

  //! Render
  return (
    <Box display="flex" justifyContent={"space-between"} mt="18px">
      <Box display="flex" alignItems={"center"}>
        <CommonStyles.Typography type="normal12">
          {title}
        </CommonStyles.Typography>
        <Hint content={hintContent} />
      </Box>
      <Box
        display="flex"
        gap={2}
        sx={{
          "& .MuiSlider-markLabel": {
            transition: "opacity 0.3s",
            opacity: "0 !important",
          },
          "&:hover": {
            "& .MuiSlider-markLabel": {
              opacity: "1 !important",
            },
          },
        }}
      >
        <FastField
          name={name}
          component={CommonField.SliderField}
          marks={marks}
          min={min}
          max={max}
          sxContainer={{
            width: "126px",
            "& .MuiSlider-root": {
              margin: 0,
              top: "50%",
              transform: "translateY(-50%)",
            },
          }}
          step={step || 0.01}
          valueLabelDisplay="auto"
        />
        <FastField
          name={name}
          component={CommonField.InputField}
          type="number"
          sxContainer={{ width: "160px" }}
          InputProps={{
            endAdornment: (
              <CustomAdornment name={name} min={min} max={max} step={step} />
            ),
          }}
          onChangeCustomize={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => handleChangeAdvance(event, name, 0, 1)}
        />
      </Box>
    </Box>
  );
};

export default memo(SlideAndNumField);
