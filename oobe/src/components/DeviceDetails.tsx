import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import "./DeviceDetails.scss";

type DeviceInfo = {
  cpuArchitecture: string;
  cpuModelCode: string;
  cpuModelName: string;
  cpuVendor: string;
  totalMemory: string;
};

const deviceInfo: DeviceInfo = {
  cpuArchitecture: "Armv8 (64-bit)",
  cpuModelCode: "Broadcom BCM2712",
  cpuModelName: "Quad-core Cortex-A76 @ 2.4 GHz",
  cpuVendor: "Broadcom",
  totalMemory: "8 GB LPDDR4-4267 SDRAM",
};

const DeviceDetailsCard: React.FC = () => {
  return (
    <Card className="device-details-card bg-dark rounded-5 border-secondary border-2">
      <Card.Body className="p-4 d-flex flex-column">
        <Card.Title className="fw-bold fs-4 mb-3 device-details-card__title">
          <FormattedMessage
            id="components.DeviceDetailsCard.title"
            defaultMessage="Device details"
          />
        </Card.Title>

        <Row className="device-details-card__item align-items-start mb-3">
          <Col xs={5} sm={4} md={3} className="device-details-card__label">
            <FormattedMessage
              id="components.DeviceDetailsCard.cpuArchitecture"
              defaultMessage="CPU architecture"
            />
          </Col>
          <Col xs={7} sm={8} md={9} className="device-details-card__value">
            {deviceInfo.cpuArchitecture}
          </Col>
        </Row>

        <Row className="device-details-card__item align-items-start mb-3">
          <Col xs={5} sm={4} md={3} className="device-details-card__label">
            <FormattedMessage
              id="components.DeviceDetailsCard.cpuModelCode"
              defaultMessage="CPU model code"
            />
          </Col>
          <Col xs={7} sm={8} md={9} className="device-details-card__value">
            {deviceInfo.cpuModelCode}
          </Col>
        </Row>

        <Row className="device-details-card__item align-items-start mb-3">
          <Col xs={5} sm={4} md={3} className="device-details-card__label">
            <FormattedMessage
              id="components.DeviceDetailsCard.cpuModelName"
              defaultMessage="CPU model name"
            />
          </Col>
          <Col xs={7} sm={8} md={9} className="device-details-card__value">
            {deviceInfo.cpuModelName}
          </Col>
        </Row>

        <Row className="device-details-card__item align-items-start mb-3">
          <Col xs={5} sm={4} md={3} className="device-details-card__label">
            <FormattedMessage
              id="components.DeviceDetailsCard.cpuVendor"
              defaultMessage="CPU vendor"
            />
          </Col>
          <Col xs={7} sm={8} md={9} className="device-details-card__value">
            {deviceInfo.cpuVendor}
          </Col>
        </Row>

        <Row className="device-details-card__item align-items-start">
          <Col xs={5} sm={4} md={3} className="device-details-card__label">
            <FormattedMessage
              id="components.DeviceDetailsCard.totalMemory"
              defaultMessage="Total memory"
            />
          </Col>
          <Col xs={7} sm={8} md={9} className="device-details-card__value">
            {deviceInfo.totalMemory}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DeviceDetailsCard;
