import { Box } from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import Hint from "./Hint";
import { FastField, useFormikContext } from "formik";
import CommonField from "../../../../../Components/CommonFields";
import CustomAdornment from "./CustomAdornment";
import { memo, useMemo } from "react";

interface ISlideAndNumField {
  hintContent?: React.ReactNode;
  title: string;
  min: number;
  max: number;
  name: string;
  step?: number;
}

const SlideAndNumField = (props: ISlideAndNumField) => {
  //! State
  const { hintContent, max, min, name, title, step } = props;
  const { setFieldValue } = useFormikContext();

  const marks = useMemo(() => {
    const arr = [];

    if (min) {
      arr.push({
        value: min,
        label: min.toString(),
      });
    }

    if (max) {
      arr.push({
        value: max,
        label: max.toString(),
      });
    }

    return arr;
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 3fr",
        gap: "16px",
      }}
    >
      <Box display="flex" alignItems={"center"}>
        <CommonStyles.Typography type="semiBold16">
          {title}
        </CommonStyles.Typography>
        {hintContent && <Hint content={hintContent} />}
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
          fullWidth
          sxContainer={{
            width: "50%",
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
          sxContainer={{ width: "50%" }}
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
