import { Row, Table } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { MedicalReportsData } from "types";

type MedicalReportsTableProps = {
  reports: MedicalReportsData[] | null;
};

const MedicalReports = ({ reports }: MedicalReportsTableProps) => {
  const intl = useIntl();
  const hasReports = reports && reports.length > 0;

  return (
    <div>
      <h5>
        <FormattedMessage
          id="reports.tableName"
          defaultMessage="Patient Medical Reports"
        />
      </h5>

      {!hasReports ? (
        <Row className="mt-3 ps-2">
          <p className="text-muted">
            <FormattedMessage
              id="reports.noMedicalReports"
              defaultMessage="No medical reports available."
            />
          </p>
        </Row>
      ) : (
        <Table className="table border-top mt-4">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="reports.type" defaultMessage="Type" />
              </th>
              <th>
                <FormattedMessage
                  id="reports.date"
                  defaultMessage="Date of medical service"
                />
              </th>
              <th>
                <FormattedMessage
                  id="reports.facility"
                  defaultMessage="Performing facility"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, id) => (
              <tr key={id}>
                <td>{report.type}</td>
                <td>
                  {report.date &&
                    intl.formatDate(report.date, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                </td>
                <td>{report.facility}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MedicalReports;
