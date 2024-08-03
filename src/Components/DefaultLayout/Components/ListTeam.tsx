
import {  Box } from "@mui/material";
import ReactPerfectScrollbar from "react-perfect-scrollbar";

interface IListTeam {}

// type Team = {
//   id: string;
//   avatar: string;
//   name: string;
//   description: string;
// };

// const TeamAvatar = ({ src }: { src: string }) => {
//   if (!src) return null;

//   return (
//     <Avatar
//       src={src}
//       sx={{
//         height: "24px",
//         width: "24px",
//       }}
//     />
//   );
// };

function ListTeam(props: IListTeam) {
  //! State
  const {} = props;

  //! Function

  //! Render

  return (
    <ReactPerfectScrollbar
      style={{
        maxHeight: "130px",
        height: "130px",
      }}
    >
      <Box display={"flex"} flexDirection={"column"} gap={"8px"}>
        {/* {teams.map((elm: Team) => {
          return (
            <NavItem
              path="/home"
              icon={<TeamAvatar src={elm.avatar} />}
              title={elm.name}
              key={elm.id}
              navActive
            />
          );
        })} */}
      </Box>
    </ReactPerfectScrollbar>
  );
}

export default ListTeam;
