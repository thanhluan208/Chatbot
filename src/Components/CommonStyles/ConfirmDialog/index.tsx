import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode, useEffect } from "react";
import CommonStyles from "..";
import CommonIcons from "../../CommonIcons";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import { useTranslation } from "react-i18next";

interface IConfirmDialog {
  handleConfirm: () => void;
  toggle: () => void;
  content: ReactNode | string;
  loading?: boolean;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  //Translation
  const { t } = useTranslation("store");
  //! State
  const { toggle, handleConfirm, content, loading } = props;
  const save = useSave();
  //! Function
  useEffect(() => {
    save(cachedKeys.OPEN_DIALOG, true);
    return () => {
      save(cachedKeys.OPEN_DIALOG, false);
    };
  }, [save]);

  //! Render
  return (
    <Box>
      <DialogTitle>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <CommonStyles.Typography type="bold18">
          {t("common.button.confirm")} {t("common.button.delete").toLowerCase()}
          </CommonStyles.Typography>
          <CommonStyles.Button
            isIcon
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <CommonStyles.Typography type="bold16">
          {t("common.toast.confirmDeleteMsg")}
        </CommonStyles.Typography>
      </DialogContent>

      <DialogActions>
        <Box
          display="flex"
          justifyContent={"end"}
          gap="16px"
          sx={{
            button: {
              fontWeight: "550",
              padding: "6px 20px",
            },
          }}
        >
          <CommonStyles.Button
            variant="contained"
            sx={{
              background: "#fff",
              color: "#000",
              "&:hover": {
                background: "#fff",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            type="button"
          >
            {t("common.button.cancel")}
          </CommonStyles.Button>
          <CommonStyles.Button
            variant="contained"
            sx={{
              color: "#fff",
            }}
            type="submit"
            color="error"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();

              if (loading) return;
              handleConfirm();
            }}
            isLoading={loading}
          >
            {t("common.button.confirm")}
          </CommonStyles.Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;
