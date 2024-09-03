import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment } from "react/jsx-runtime";

interface ViewmoreConfigProps {
  data?: any;
}

const ViewmoreConfig = ({  }: ViewmoreConfigProps) => {
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
      >
        <CommonStyles.Typography type='semiBold12' color="#06070980">View more</CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
};

export default ViewmoreConfig;