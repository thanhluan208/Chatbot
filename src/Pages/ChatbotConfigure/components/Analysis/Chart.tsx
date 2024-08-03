import { Box, Tooltip } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";

const Total = ({ total }: { total: number }) => {
  //! State
  const [value, setValue] = useState(0);

  //! Function
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        let step = 10;
        if (total > 1000) {
          step = 100;
        }
        if (total > 10000) {
          step = 1000;
        }
        const offset = Math.floor((Math.random() * step) / 2 + step * 2);
        if (prev + offset > total) {
          clearInterval(interval);
          return total;
        }
        return prev + offset;
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  //! Render

  return (
    <CommonStyles.Typography type="semiBold32" mb="24px">
      {value}
    </CommonStyles.Typography>
  );
};

interface IChart {
  title: string;
  total: number;
  data: number[];
  day: string[];
  name: string;
}

function Chart(props: IChart) {
  //! State
  const { title, data, day, total } = props;

  const options = {
    chart: {
      type: "spline",
      height: 245,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: day,
      accessibility: {
        description: "Months of the year",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        format: "",
      },
    },
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: "#666666",
          lineWidth: 1,
        },
      },
    },
    series: [
      {
        name: "Total",
        marker: {
          symbol: "square",
        },
        data,
      },
    ],
  };

  //! Function

  //! Render
  return (
    <Box
      sx={{
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          svg: {
            height: 16,
            weight: 16,
          },
        }}
      >
        <CommonStyles.Typography type="bold18">{title}</CommonStyles.Typography>
        <Tooltip
          placement="top-end"
          title="The number of users with effective communication every day. The criterion for effective communication is one question and one answer or more."
        >
          <CommonIcons.InfoOutlined />
        </Tooltip>
      </Box>
      <Total total={total} />
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}

export default Chart;
