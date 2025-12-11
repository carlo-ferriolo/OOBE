import ReactApexChart from "react-apexcharts";
import { type ApexOptions } from "apexcharts";
import { Row, Col } from "react-bootstrap";
import "./SystemResourceUsage.scss";
import { FormattedMessage } from "react-intl";

interface DataPoint {
  x: number;
  y: number;
}

export interface SystemResourceUsageProps {
  cpuData: DataPoint[];
  ramData: DataPoint[];
  realTimeCpu: number;
  realTimeRam: number;
}

const SystemResourceUsage = ({
  cpuData,
  ramData,
}: SystemResourceUsageProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: false },
      zoom: { enabled: false },
      background: "transparent",
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    colors: ["#00FFAA", "#007BFF"],
    grid: {
      borderColor: "#444",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#fff", fontSize: "12px" },
      },
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (v) => `${v}%`,
        style: { colors: "#fff", fontSize: "12px" },
      },
    },
    tooltip: { theme: "dark" },
    legend: { show: false },
    markers: { size: 0 },
    dataLabels: { enabled: false },
  };

  const series = [
    { name: "CPU", data: cpuData },
    { name: "RAM", data: ramData },
  ];

  return (
    <>
      <Row className="align-items-center mb-4 system-usage-row">
        <Col xs="auto">
          <span className="fw-bold fs-4 text-light">
            <FormattedMessage
              id="components.SystemResourceUsage.title"
              defaultMessage="Resource usage"
            />
          </span>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <span className="dot dot-ram me-2" />
          <span className="text-light fw-semibold">
            <FormattedMessage
              id="components.SystemResourceUsage.ramUsage"
              defaultMessage="RAM"
            />
          </span>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <span className="dot dot-cpu me-2" />
          <span className="text-light fw-semibold">
            <FormattedMessage
              id="components.SystemResourceUsage.cpuUsage"
              defaultMessage="CPU usage"
            />
          </span>
        </Col>
      </Row>

      <ReactApexChart
        options={chartOptions}
        series={series}
        type="line"
        height={window.innerWidth < 576 ? 200 : 300}
      />
    </>
  );
};

export default SystemResourceUsage;
