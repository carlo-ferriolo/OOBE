import { ReactNode } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

type DataSectionProps = {
  label: ReactNode;
  value: number | string | null;
};

const DataSection = ({ label, value }: DataSectionProps) => {
  return (
    <div className="text-center">
      <p>
        <p>{label}</p>
      </p>
      {value === null ? (
        <span className="h2">
          <FormattedMessage id="no_data" defaultMessage="N/A" />
        </span>
      ) : (
        <span className="h2">{value}</span>
      )}
    </div>
  );
};

export default DataSection;
