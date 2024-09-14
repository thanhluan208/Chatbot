import { Box } from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import { getIn, useFormikContext } from "formik";

interface ICustomAdornment {
  name: string;
  max: number;
  min: number;
  step?: number;
}

const CustomAdornment = (props: ICustomAdornment) => {
  //! State
  const { max, min, name, step = 0.01} = props;
  const { values, setFieldValue } = useFormikContext();
  const value = getIn(values, name);

  //! Function
  const handleChange = (newValue: number) => {
    setFieldValue(name, parseFloat(newValue.toFixed(2)));
  };

  //! Render
  return (
    <Box
      display="flex"
      sx={{
        button: {
          padding: "4px",
          width: 24,
          height: 24,
          borderRadius: `8px`,
        },
        svg: {
          width: 14,
          height: 14,
        },
      }}
    >
      <CommonStyles.Button
        isIcon
        disabled={value - step < min}
        onClick={() => handleChange(value ? value - step : max - step)}
      >
        <CommonIcons.Remove />
      </CommonStyles.Button>
      <CommonStyles.Button
        isIcon
        disabled={value + step > max}
        onClick={() => handleChange(value ? value + step : min + step)}
      >
        <CommonIcons.Add />
      </CommonStyles.Button>
    </Box>
  );
};

export default CustomAdornment;
