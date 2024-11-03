import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Variable } from "@/Types/workflow";
import { Box, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import NodeForm from "./NodeForm";

interface AddOrEditInputDialogProps {
  openDialog: boolean;
  handleClose: () => void;
  data?: Variable;
  nodeId: string;
}

const AddOrEditInputDialog = ({
  handleClose,
  openDialog,
  data,
  nodeId
}: AddOrEditInputDialogProps) => {
  const { t } = useTranslation("node");

  return (
    <CommonStyles.Dialog
      open={openDialog}
      toggle={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <Box>
        <DialogTitle>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={3}
          >
            <CommonStyles.Typography type="semiBold18">
              {!data
                ? t("WF_Startnode.add_input_field")
                : t("WF_Startnode.edit_input_field")}
            </CommonStyles.Typography>
            <CommonStyles.Button isIcon hasBorder={false} onClick={handleClose}>
              <CommonIcons.Clear />
            </CommonStyles.Button>
          </Box>
        </DialogTitle>

        <NodeForm data={data} nodeId={nodeId} toggle={handleClose}/>
      </Box>
    </CommonStyles.Dialog>
  );
};

export default AddOrEditInputDialog;
