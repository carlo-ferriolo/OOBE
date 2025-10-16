import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Dashboard.scss";
import { FormattedMessage } from "react-intl";

const Dashboard: React.FC = () => {
  const [time, setTime] = useState("");

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      fluid
      className="dashboard-container bg-dark min-vh-100 d-flex flex-column p-3"
    >
      <Row className="justify-content-center flex-grow-1">
        <Col
          xs={10}
          sm={6}
          md="auto"
          className="d-flex flex-column align-items-center justify-content-center h-100"
        >
          <div className="clock-container">{time}</div>

          <h2 className="dashboard-title fw-bold text-center mt-2">
            <FormattedMessage
              id="pages.Dashboard.title"
              defaultMessage="Dashboard"
            />
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
