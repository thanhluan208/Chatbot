import { CheckboxProps, Checkbox } from "@mui/material";
import { FieldProps } from "formik";

interface ICheckBoxField {
  onChangeCustomize?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  afterOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBoxField = (props: ICheckBoxField & FieldProps & CheckboxProps) => {
  //! State
  const { form, field, onChangeCustomize, afterOnChange } = props;
  const { name, value } = field;
  const { setFieldValue } = form;
  //! Function
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeCustomize) {
      onChangeCustomize(event);
      return;
    } else {
      setFieldValue(name, event.target.checked);
      afterOnChange && afterOnChange(event);
    }
  };

  //! Render
  return <Checkbox value={value} checked={value} onChange={handleChange}  sx={{
    height:"39px"
  }}/>;
};

export default CheckBoxField;
