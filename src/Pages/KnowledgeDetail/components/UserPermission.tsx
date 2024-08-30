import { Box } from "@mui/material";
import { FastField } from "formik";
import CommonField from "../../../Components/CommonFields";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import UserSelectField from "./UserSelect";

interface IUserPermission {
  name: string;
  remove: () => void;
}

export const PermissionOption = [
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
      
      <UserSelectField name={`${name}.user`} />
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
