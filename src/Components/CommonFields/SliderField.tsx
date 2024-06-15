import { Box, Slider, SliderProps } from "@mui/material";
import { FieldProps } from "formik";

interface ISliderField {
  sxContainer?: {};
  onChangeCustomize?: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  afterOnChange?: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
}

const SliderField = (props: ISliderField & SliderProps & FieldProps) => {
  //! State
  const {
    field,
    form,
    sxContainer,
    onChangeCustomize,
    afterOnChange,
    ...otherProps
  } = props;

  const { setFieldValue } = form;
  const { name, value } = field;

  //! Function
  const handleChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    if (onChangeCustomize) {
      onChangeCustomize(event, value, activeThumb);
    } else {
      setFieldValue(name, value);

      afterOnChange && afterOnChange(event, value, activeThumb);
    }
  };

  //! Render
  return (
    <Box
      sx={{
        ...sxContainer,
      }}
    >
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
        {...otherProps}
      />
    </Box>
  );
};

export default SliderField;
