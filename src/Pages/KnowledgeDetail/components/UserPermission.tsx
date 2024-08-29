import { Box } from "@mui/material";
import { FastField, Field } from "formik";
import CommonField from "../../../Components/CommonFields";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";

interface IUserPermission {
  name: string;
  remove: () => void;
}

export const PermissionOption = [
  {
    value: "owner",
    label: "Owner",
  },
  {
    value: "editor",
    label: "Editor",
  },
  {
    value: "viewer",
    label: "Viewer",
  },
  {
    value: "commentor",
    label: "Commentor",
  },
];

const UserPermission = ({ name, remove }: IUserPermission) => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "45% 45% 5%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop:'10px'
      }}
    >
      
      <Field
        name={`${name}.user`}
        component={CommonField.MuiSelectField}
        placeholder="Select user"
        options={PermissionOption}
        fullWidth
        sxContainer={{
            textAlign:'right'
        }}
        variant="standard"

      />
      <FastField
        name={`${name}.permission`}
        component={CommonField.MuiSelectField}
        placeholder="Select permission"
        options={PermissionOption}
        fullWidth
        variant="standard"

      />
      <CommonStyles.Button isIcon onClick={(e) => {
        e.preventDefault();
        remove();
      }} color="error">
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Box>
  );
};

export default UserPermission;
