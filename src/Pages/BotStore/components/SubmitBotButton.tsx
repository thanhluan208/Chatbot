import CommonStyles from "@/Components/CommonStyles";
import useGetListBot from "@/Hooks/Bot/useGetListBot";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import SubmitBotDialog from "./SubmitBotDialog";

const filters = {
  visual_option: "owned",
};

const SubmitBotButton = () => {
  //! State
  const { t } = useTranslation("store");
  const { data, isLoading } = useGetListBot(filters);
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <SubmitBotDialog data={data?.data || []} toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button variant="contained" disabled={isLoading}>
        {t("botStore.button.submitBot")}
      </CommonStyles.Button>
    </Fragment>
  );
};

export default SubmitBotButton;
