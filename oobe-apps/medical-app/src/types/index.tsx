export type PatientOverviewData = {
  name: string;
  age: number;
  bloodType: string;
  height: number;
  phisician: string;
  weight: number;
  hospitalizationReason: string;
};

export type PatientOverviewDto = {
  name: string;
  age: number;
  blood_type: string;
  height: number;
  phisician: string;
  weight: number;
  hospitalization_reason: string;
};

export type MedicalReportsData = {
  type: string;
  facility: string;
  date: Date;
};

export type VitalSignsData = {
  ecg: number;
  systolicPressure: number;
  diastolicPressure: number;
  oxygenSaturation: number;
  timestamp: Date;
};

export type VitalSignsDto = {
  ecg: number;
  systolic_pressure: number;
  diastolic_pressure: number;
  oxygen_saturation: number;
  timestamp: Date;
};
