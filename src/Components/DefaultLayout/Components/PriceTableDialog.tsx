import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment } from "react";
import NavItem from "./NavItem";
import CommonIcons from "@/Components/CommonIcons";
import { Box, useTheme } from "@mui/material";

interface EachPlanProps {
  name: string;
  price: number;
  limit: number;
  model: {
    name: string;
    limitCredit?: number;
    limitMsg?: number;
  }[];
  isCurrentPlan?: boolean;
  shouldHighlight?: boolean;
}

const EachPlan = (props: EachPlanProps) => {
  const { model, isCurrentPlan, shouldHighlight } = props;
  const theme = useTheme()

  return (
    <Box
      className="each-plan"
      sx={{
        borderRadius: "16px",
        border: "1px solid #06070920",
        background: theme.colors.custom.backgroundCard,
        overflow: "hidden",
        maxHeight: "600px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        paddingBottom: "20px",
      }}
      onScroll={(e: any) => {
        const eachPlan = document.getElementsByClassName("each-plan");
        const eachPlanHeader =
          document.getElementsByClassName("each-plan-header");
        for (let i = 0; i < eachPlan.length; i++) {
          const element = eachPlanHeader[i] as any;
          eachPlan[i].scrollTop = e.target.scrollTop;
          if (e.target.scrollTop > 0) {
            element.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.05)";
          }
          if (e.target.scrollTop === 0) {
            element.style.boxShadow = "none";
          }
        }
      }}
    >
      <Box
        className="each-plan-header"
        sx={{
          background: theme.colors.custom.backgroundCard,
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "20px",
          transition: "all 0.3s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <CommonStyles.Typography type="semiBold16" color="#06070980">
            {props.name}
          </CommonStyles.Typography>
          <span>
            <CommonStyles.Typography
              component={"span"}
              style={{
                fontSize: "42px",
                fontWeight: "700",
                lineHeight: 1.2,
                marginRight: "4px",
              }}
            >
              {props.price}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              component={"span"}
              style={{
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: 1.2,
                color: "#06070980",
              }}
            >
              USD / month
            </CommonStyles.Typography>
          </span>
          <CommonStyles.Typography type="semiBold16" color="#06070980">
            {props.limit} message credits/day
          </CommonStyles.Typography>
        </Box>
        <CommonStyles.Button
          variant={shouldHighlight ? "contained" : "outlined"}
          sx={{
            marginTop: "12px",
            border: shouldHighlight ? "" : "1px solid #000",
            color: isCurrentPlan
              ? "#000"
              : shouldHighlight
              ? "#fff"
              : "#4e40e5",
            background: isCurrentPlan
              ? "#f9f9f9"
              : shouldHighlight
              ? "#4e40e5"
              : "#f1f2ff",
          }}
          fullWidth
        >
          <CommonStyles.Typography>
            {isCurrentPlan ? "Current plan" : "Start 3 days free trial"}
          </CommonStyles.Typography>
        </CommonStyles.Button>
      </Box>
      <CommonStyles.Typography
        type="normal12"
        color={"#06070980"}
        sx={{
          padding: "0 20px",
          marginBottom: "20px",
        }}
      >
        Models
      </CommonStyles.Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "0 20px",
        }}
      >
        {model.map((item) => {
          return (
            <Box key={item.name}>
              <CommonStyles.Typography type="semiBold14">
                {item.name}
              </CommonStyles.Typography>
              <CommonStyles.Typography color={"#06070980"}>
                {item.limitCredit} credits / {item.limitMsg} messages
              </CommonStyles.Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const plans = [
  {
    name: "Free",
    price: 0,
    limit: 10,
    model: [
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
      {
        name: "GPT-3.5 (16K)",
        limitCredit: 0.1,
        limitMsg: 100,
      },
    ],
  },
];

const PriceTableDialog = () => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();
  const theme = useTheme()
  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          onClose={toggle}
          toggle={toggle}
          maxWidth={"xmd" as any}
        >
          <Box
            sx={{
              width: "100vw",
              maxWidth: "100%",
              padding: "24px 16px",
              background: theme.colors.custom.backgroundDialog,
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <CommonStyles.Typography type="semiBold18">
                Alphii premium pricing plans
              </CommonStyles.Typography>
              <CommonStyles.Button isIcon onClick={toggle}>
                <CommonIcons.Clear />
              </CommonStyles.Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "16px",
              background: "#f9f9f9",
              padding: "20px",
            }}
          >
            {[...plans, ...plans, ...plans, ...plans].map((plan, index) => {
              return (
                <EachPlan
                  key={index}
                  {...plan}
                  isCurrentPlan={index === 0}
                  shouldHighlight={index === 3}
                />
              );
            })}
          </Box>
        </CommonStyles.Dialog>
      )}
      <NavItem
        icon={<CommonIcons.PriceChange />}
        title="Alphii premium"
        navActive
        onClick={toggle}
      />
    </Fragment>
  );
};

export default PriceTableDialog;
