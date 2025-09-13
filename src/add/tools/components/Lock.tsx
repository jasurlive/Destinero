import "../../css/home.css";

interface LockOverlayProps {
  locked: boolean;
  children: (locked: boolean) => React.ReactNode;
}

const LockOverlay: React.FC<LockOverlayProps> = ({ locked, children }) => {
  return (
    <div>
      {locked && <div className="map-lock-overlay" />}
      {children(locked)}
    </div>
  );
};

export default LockOverlay;
