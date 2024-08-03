import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import { useState } from "react";
import Chart from "./Analysis/Chart";
import PerfectScrollBar from "react-perfect-scrollbar";
import moment from "moment";

const UserDailydata: number[] = [];
const NewUserDailydata: number[] = [];
const UserWeeklydata: number[] = [];
const NewUserWeeklydata: number[] = [];
const day: string[] = [];
const week: string[] = [];
let totalUser = 0;
let totalNewUser = 0;
let totalUserWeek = 0;
let totalNewUserWeek = 0;
const firstDay = moment().startOf("week");
const firstDayOfMonth = moment().startOf("month");

for (let i = 0; i < 7; i++) {
  const number = Math.floor(Math.random() * 2000 + 18000);
  const numberNew = Math.floor(Math.random() * 700 + 6000);

  if (i < 5) {
    const numberMonth = Math.floor(Math.random() * 10000 + 90000);
    const numberNewMonth = Math.floor(Math.random() * 3500 + 30000);
    UserWeeklydata.push(numberMonth);
    NewUserWeeklydata.push(numberNewMonth);

    totalUserWeek += numberMonth;
    totalNewUserWeek += numberNewMonth;
    week.push(
      `${firstDayOfMonth
        .clone()
        .add(i, "week")
        .startOf("week")
        .format("DD/MM/YYYY")} ~ ${firstDayOfMonth
        .clone()
        .add(i, "week")
        .endOf("week")
        .format("DD/MM/YYYY")}`
    );
  }

  UserDailydata.push(number);
  NewUserDailydata.push(numberNew);
  totalUser += number;
  totalNewUser += numberNew;
  day.push(firstDay.clone().add(i, "days").format("DD/MM/YYYY"));
}

const Analysis = () => {
  //! State
  const [tab, setTab] = useState("overview");
  const theme: any = useTheme();

  //! Function

  //! Render
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "24px",
          alignItems: "center",
          boxShadow: "0 20px 45px rgb(235 234 234 / 100%)",
          position: "relative",
          zIndex: 10000,
          background: "#efefefbd",
        }}
      >
        <Box display={"flex"} gap={"16px"}>
          <CommonStyles.Typography
            type={tab === "overview" ? "bold18" : "semiBold18"}
            color={tab === "overview" ? theme.palette.primary.main : ""}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setTab("overview")}
          >
            Overview
          </CommonStyles.Typography>
          <CommonStyles.Typography
            type={tab !== "overview" ? "bold18" : "semiBold18"}
            color={tab !== "overview" ? theme.palette.primary.main : ""}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setTab("analytics")}
          >
            Query Analytics
          </CommonStyles.Typography>
        </Box>
      </Box>
      <PerfectScrollBar
        style={{
          maxHeight: "calc(100vh - 74px - 75px)",
          height: "calc(100vh - 74px -75px)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "48px 24px 24px",
            gap: "24px",
          }}
        >
          <Chart
            title="Daily active user"
            name="dailyActiveUser"
            data={UserDailydata}
            total={totalUser}
            day={day}
          />
          <Chart
            title="Week active user"
            name="weeklyActiveUser"
            data={UserWeeklydata}
            day={week}
            total={totalUserWeek}
          />
          <Chart
            title="Daily new user"
            name="dailyNewUser"
            data={NewUserDailydata}
            total={totalNewUser}
            day={day}
          />
          <Chart
            title="Week new user"
            name="weeklyNewUser"
            data={NewUserWeeklydata}
            day={week}
            total={totalNewUserWeek}
          />
        </Box>
      </PerfectScrollBar>
    </Box>
  );
};

export default Analysis;
