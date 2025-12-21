import Flag from "react-flagkit";
import "../css/popup.css";

export const useCountryFlag = (countryCode: string) => {
  return <Flag country={countryCode} className="flag-size" />;
};
