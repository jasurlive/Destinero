import { PiFlagPennantFill, PiHeartbeatFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FaHiking } from "react-icons/fa";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";
import "../css/places.css";

const LEGEND = [
  { type: "visited", icon: <PiFlagPennantFill />, text: "Places I've been to" },
  { type: "planned", icon: <BiSolidPlaneAlt />, text: "Places on the wish list" },
  { type: "highlighted", icon: <PiHeartbeatFill />, text: "Highlighted places" },
  { type: "searched", icon: <HiMiniViewfinderCircle />, text: "Result of a search" },
  { type: "live", icon: <FaHiking />, text: "Your current location" },
  { type: "clicked", icon: <IoLocationSharp />, text: "A pin you dropped by clicking the map" },
];

export default function Help() {
  return (
    <div className="page-container help">
      <h1 className="page-title">Help</h1>

      <section>
        <h2 className="help-heading">Map pins</h2>
        <ul className="help-legend">
          {LEGEND.map(({ type, icon, text }) => (
            <li key={type}>
              <span className={`pin pin-${type}`}>{icon}</span>
              <span>
                <b>{type}</b> — {text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="help-heading">Shortcuts</h2>
        <p className="page-text">
          <kbd>Ctrl</kbd> + <kbd>J</kbd> switches between light and dark theme.
        </p>
      </section>

      <section>
        <h2 className="help-heading">Adding places</h2>
        <p className="page-text">
          All places live in <code>public/data/places.csv</code> (<code>type,name,lat,lng,image</code>).
          Edit it by hand or use the helper:
        </p>
        <pre className="help-code">{`python python/places.py add "Tokyo, Japan" 35.68,139.76 --type planned --image https://…
python python/places.py list`}</pre>
      </section>
    </div>
  );
}
