import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useIntl } from "react-intl";

const BAD_STATE = "#FF0000";
const GOOD_STATE = "#02b902";

type ChartSeries = {
  name: string;
  data: number[];
};

type SampleIntegrityCheckBarChartProps = {
  categories: string[];
  series: ChartSeries[];
  title?: string;
};

const IndustrialBarChart: React.FC<SampleIntegrityCheckBarChartProps> = ({
  categories,
  series,
  title,
}) => {
  const intl = useIntl();

  const chartTitle =
    title ||
    intl.formatMessage({
      id: "sampleIntegrityCheck",
      defaultMessage: "Sample integrity check",
    });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: [BAD_STATE, GOOD_STATE],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        trim: false,
        hideOverlappingLabels: false,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
    },
    title: {
      text: chartTitle,
      align: "left",
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default IndustrialBarChart;
