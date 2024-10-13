import { Box, Tooltip } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";

const NameTag = (props: { name: string; avatar: string; tooltip?: string, round?:boolean }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
      }}
    >
      <Tooltip title={props.tooltip}>
        <img
          src={props.avatar}
          style={{
            aspectRatio: "1",
            width: "14px",
            borderRadius: props?.round ? '50%' : '0',
          }}
        />
      </Tooltip>
      <CommonStyles.Typography type="normal12" color={"#ffffffc9"}>
        {props.name}
      </CommonStyles.Typography>
    </Box>
  );
};

interface HighlightCardProps {
  background?: string;
  name: string;
  category: string;
  space: string;
  creator: string;
}

const HighlightCard = (props: HighlightCardProps) => {
  //! State
  const {
    category,
    creator,
    name,
    space,
    background = "https://i.pinimg.com/564x/83/a5/d4/83a5d4d329ace4b153356a1f59ad38ad.jpg",
  } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        width: "480px",
        height: "270px",
        background: `url(${background})`,
        backgroundSize: "contain",
        borderRadius: "12px",
        boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          padding: "32px 24px 24px",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
          bottom: "0",
          left: 0,
          width: "100%",
          display: "flex",
          gap: "16px",
        }}
      >
        <img
          src="https://p16-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/d17352f1338b46e8b7059a9fb45b6d69~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727591357&x-signature=nbhz8wQHiXAhpNnvq8DdpCBiT4M%3D"
          style={{
            aspectRatio: "1",
            width: "64px",
            borderRadius: "8px",
          }}
        />
        <Box
          sx={{
            color: "#fff",
          }}
        >
          <CommonStyles.Typography type="normal10">
            {category}
          </CommonStyles.Typography>
          <CommonStyles.Typography type="semiBold18">
            {name}
          </CommonStyles.Typography>
          <Box sx={{display:'flex',gap:'4px'}}>
            <NameTag
              name={space}
              round
              avatar="https://sf16-passport-sg.ibytedtos.com/img/user-avatar-alisg/88b9207c15f5deb3ebda52eb369b85a8~300x300.image"
            />
            <NameTag
              name={creator}
              tooltip="Top developer"
              avatar="https://sf16-bot-platform-tos-sign.coze.com/obj/bot-studio-bot-platform-sg/FileBizType.BIZ_LABEL_ICON/0_1721634266433275972_F2UPYqurVT.image/png?lk3s=50ccb0c5&x-expires=1725085757&x-signature=40FhpKKdH20O6DdYFJI%2BoExHRfA%3D"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HighlightCard;
