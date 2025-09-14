import Flag from "react-flagkit";

export const getCountryFlag = (countryCode: string) => {
  return <Flag country={countryCode} />;
};
