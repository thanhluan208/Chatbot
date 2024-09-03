import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment } from "react/jsx-runtime";

interface ViewmoreConfigProps {
  data?: any;
}

const AddComment = ({  }: ViewmoreConfigProps) => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog open={open} onClose={toggle} toggle={toggle}>
          hi
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        sx={{
          minHeight: "unset",
          padding: "0 8px",
          color:'unset'
        }}
        startIcon={<CommonIcons.Add />}
      >
        <CommonStyles.Typography type='semiBold12' color="#06070980">Add comment</CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
};

export default AddComment;