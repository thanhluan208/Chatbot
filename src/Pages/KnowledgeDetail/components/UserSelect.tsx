import { Field } from "formik";
import CommonField from "../../../Components/CommonFields";
import useGetListUser from "../../../Hooks/User/useGetListUser";
import { useMemo, useRef, useState } from "react";
import { processOption } from "../../../Helpers";

interface IUserSelectField {
  name: string;
}

const UserSelectField = (props: IUserSelectField) => {
  //! State
  const { name } = props;
  const [search, setSearch] = useState("");
  const { data } = useGetListUser(search);
  const debounceRef = useRef<number | null>(null);

  const options = useMemo(() => {
    return processOption(data, "user_id", "user_name");
  },[data])
  //! Function
  const handleInputChange = (_: React.SyntheticEvent, value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  //! Render
  return (
    <Field
      name={name || "user"}
      placeholder="Select user"
      component={CommonField.AutocompleteField}
      textFieldProps={{
        fullWidth: true,
        variant: "standard",
      }}
      onInputChange={handleInputChange}
      options={options}
    />
  );
};

export default UserSelectField