import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Stack } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { defineMessages } from "react-intl";

import ButtonsStack from "./ButtonsStack";

const { forwardRef, useState } = React;

type DateRange = [Date, Date];

type RangePreset = "Day" | "Week" | "Month" | "Year";

const dateRangeMessages = defineMessages({
  day: {
    id: "day",
    defaultMessage: "Day",
  },
  week: {
    id: "week",
    defaultMessage: "Week",
  },
  month: {
    id: "month",
    defaultMessage: "Month",
  },
  year: {
    id: "year",
    defaultMessage: "Year",
  },
});

type PresetOption = {
  name: RangePreset;
  messageId: string;
};

const presetOptions: PresetOption[] = [
  {
    name: "Day",
    messageId: dateRangeMessages.day.id,
  },
  {
    name: "Week",
    messageId: dateRangeMessages.week.id,
  },
  {
    name: "Month",
    messageId: dateRangeMessages.month.id,
  },
  {
    name: "Year",
    messageId: dateRangeMessages.year.id,
  },
];

const isRangePreset = (value: any): value is RangePreset =>
  value === "Day" || value === "Week" || value === "Month" || value === "Year";

const presetToDateRange = (preset: RangePreset): DateRange => {
  const now = new Date();
  const aDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const aWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const aMonthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const aYearAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);

  switch (preset) {
    case "Day":
      return [aDayAgo, now];
    case "Week":
      return [aWeekAgo, now];
    case "Month":
      return [aMonthAgo, now];
    case "Year":
      return [aYearAgo, now];
  }
};

type RangeSelectorProps = {
  value: DateRange | RangePreset;
  isDisabled: boolean;
  onChange: (value: DateRange | RangePreset) => void;
};

const RangeSelect = ({ value, isDisabled, onChange }: RangeSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    end?.setHours(23);
    end?.setMinutes(59);
    end?.setSeconds(59);
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const newDateRange: [Date, Date] = [start, end];
      onChange(newDateRange);
    }
  };

  const CustomInput = forwardRef<
    HTMLButtonElement,
    React.HTMLProps<HTMLButtonElement>
  >(({ onClick }, ref) => {
    const value =
      startDate && endDate
        ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
        : "";
    return (
      <Button
        className="p-2 rounded bg-light border-0"
        onClick={onClick}
        ref={ref}
        disabled={isDisabled}
      >
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="fa-lg"
          style={{
            color: "var(--bs-primary)",
            width: "1.3em",
            height: "1.3em",
          }}
        />
      </Button>
    );
  });

  const selectedPreset = isRangePreset(value) ? value : null;

  return (
    <Stack direction="horizontal" gap={2} className="justify-content-end">
      <div className="p-1 rounded border border-primary">
        <ButtonsStack
          value={selectedPreset}
          options={presetOptions}
          onChange={onChange}
          allDisabled={isDisabled}
        />
      </div>
      <div className="p-1 rounded border border-primary" style={{ zIndex: 12 }}>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          monthsShown={2}
          onChange={onDateChange}
          maxDate={new Date()}
          customInput={<CustomInput />}
          selectsRange
        />
      </div>
    </Stack>
  );
};

export default RangeSelect;

export { isRangePreset, presetToDateRange };

export type { DateRange, RangePreset };
