import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

interface ViewmoreConfigProps {
  data?: any;
}

const AddComment = ({  }: ViewmoreConfigProps) => {
  //Translation
  const { t } = useTranslation("store");

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
        <CommonStyles.Typography type='semiBold12' color="#06070980">
          {t("chatBot.button.addComment")}
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
};

export default AddComment;