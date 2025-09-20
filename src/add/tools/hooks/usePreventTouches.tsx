import { useEffect, RefObject } from "react";

export function usePreventTouches(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const stopEvent = (e: Event) => e.stopPropagation();

    const events = ["mousedown", "click", "wheel", "touchstart", "touchmove"];

    events.forEach((event) =>
      element.addEventListener(event, stopEvent, { capture: true })
    );

    return () => {
      events.forEach((event) =>
        element.removeEventListener(event, stopEvent, { capture: true })
      );
    };
  }, [ref]);
}
