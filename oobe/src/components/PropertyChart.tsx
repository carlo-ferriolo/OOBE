import ReactApexChart from "react-apexcharts";
import { type ApexOptions } from "apexcharts";
import { Card, Row } from "react-bootstrap";
import "./PropertyChart.scss";

interface DataPoint {
  x: number;
  y: number;
}

type PropertyChartProps = {
  chartName: string;
  chartColor?: "blue" | "orange" | "green" | "red";
  chartData: DataPoint[];
  realTimeData?: string;
};

const PropertyChart = ({
  chartName,
  chartColor,
  chartData,
  realTimeData,
}: PropertyChartProps) => {
  const baseChartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 0.5,
    },
    grid: {
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors:
      chartColor === "blue"
        ? ["#00C2FF"]
        : chartColor === "orange"
          ? ["#FF6B00"]
          : chartColor === "red"
            ? ["#FF0000"]
            : ["#0FFF00"],
  };

  function capitalizeFirstLetter(val: string | undefined) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  return (
    <Card className="production-graph-card rounded-5 border-secondary border-2">
      <Card.Body className="d-flex flex-column">
        <Row className="flex-grow-1 justify-content-center align-items-center">
          <Card.Title className="fw-bold fs-5 mb-1 ms-1 justify-content-center text-center">
            {chartName}
          </Card.Title>
          <Card.Text className="fw-bold fs-2 mb-4 ms-1 justify-content-center text-center">
            {capitalizeFirstLetter(realTimeData) || "Loading..."}
          </Card.Text>
        </Row>

        <div className="usage-section d-flex flex-column">
          <ReactApexChart
            options={{ ...baseChartOptions }}
            series={[{ name: chartName, data: chartData }]}
            type="area"
            height={142}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyChart;
