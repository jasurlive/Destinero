import { Marker as LeafletMarker, Popup, useMap } from "react-leaflet";
import { DivIcon } from "leaflet";
import { PiFlagPennantFill, PiHeartbeatFill } from "react-icons/pi";
import { FaHiking } from "react-icons/fa";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";
import ReactDOMServer from "react-dom/server";
import { useEffect, useRef } from "react";
import PopUp from "./PopUp";
import { AllPlaceTypes } from "../hooks/useFetchExcel";
import "../css/marker.css";

const iconMap: Record<AllPlaceTypes["type"], React.ReactElement> = {
  visited: <PiFlagPennantFill className="marker-icon visited" />,
  planned: <BiSolidPlaneAlt className="marker-icon planned" />,
  highlighted: <PiHeartbeatFill className="marker-icon highlighted" />,
  searched: <HiMiniViewfinderCircle className="marker-icon searched" />,
  live: <FaHiking className="marker-icon live" />,
  clicked: <IoLocationSharp className="marker-icon clicked" />,
};

type MarkerProps = {
  place: AllPlaceTypes;
  autoOpen?: boolean;
};

const Marker = ({ place, autoOpen }: MarkerProps) => {
  const map = useMap();
  const markerRef = useRef<any>(null);

  const iconHtml = ReactDOMServer.renderToString(iconMap[place.type]);
  const divIcon = new DivIcon({
    html: iconHtml,
    className: "custom-div-icon",
    iconAnchor: [15, 10],
  });

  useEffect(() => {
    if (!autoOpen || !markerRef.current) return;

    markerRef.current.openPopup();
  }, []);

  return (
    <LeafletMarker
      position={place.coords}
      icon={divIcon}
      ref={markerRef}
      eventHandlers={{
        popupopen: () => {
          map.flyTo(place.coords, map.getZoom(), {
            animate: true,
            duration: 0.6,
          });
        },
      }}
    >
      <Popup>
        <PopUp place={place} />
      </Popup>
    </LeafletMarker>
  );
};

export default Marker;
