import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { Segment } from "@/Hooks/Knowledges/useGetListSegments";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer, useTheme } from "@mui/material";

const DetailItem = (props: { label: string; value: string }) => {
  const { label, value } = props;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        margin: "12px 0",
      }}
    >
      <CommonStyles.Typography type="semiBold14">
        {label}:
      </CommonStyles.Typography>
      <CommonStyles.Typography>{value}</CommonStyles.Typography>
    </Box>
  );
};

const SegmentDetail = () => {
  //! State
  const detail: Segment = useGet("SEGMENT_DETAIL");
  const save = useSave();
  const theme = useTheme();

  //! Function
  const handleClose = () => {
    save(cachedKeys.SEGMENT_DETAIL, undefined);
  };

  //! Render
  return (
    <Drawer
      anchor="right"
      open={!!detail}
      onClose={handleClose}
      sx={{
        zIndex: 999999,
      }}
    >
      <Box
        sx={{
          width: 400,
          height: "100vh",
          background: theme.colors.custom.backgroundSecondary,
          padding: "16px 24px",
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CommonStyles.Typography type="semiBold16">
            Segment Detail
          </CommonStyles.Typography>
          <CommonStyles.Button isIcon onClick={handleClose} isRound={false}>
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>

        <DetailItem label="Mime type" value={detail?.mime_type} />
        <DetailItem label="Page label" value={detail?.page_label} />
        <CommonStyles.Typography type="semiBold14">
          Content:
        </CommonStyles.Typography>
        <Box
          sx={{
            padding: "12px 24px",
            background: theme.colors.custom.backgroundCard,
            borderRadius: "12px",
            marginTop: "20px",
            boxShadow: theme.colors.custom.boxShadow,
          }}
        >
          <CommonStyles.Typography
            sx={{
              whiteSpace: "pre-line",
            }}
          >
            {detail?.text}
          </CommonStyles.Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SegmentDetail;
