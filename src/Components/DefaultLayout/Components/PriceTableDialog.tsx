import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment } from "react";
import NavItem from "./NavItem";
import CommonIcons from "@/Components/CommonIcons";
import { Box } from "@mui/material";

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
  return (
    <Box
      sx={{
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #06070920",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          paddingBottom: "20px",
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
      <CommonStyles.Typography type="normal12" color={"#06070980"}>
        Models
      </CommonStyles.Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
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
    ],
  },
];

const PriceTableDialog = () => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();

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
              background: "#f9f9f9",
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
