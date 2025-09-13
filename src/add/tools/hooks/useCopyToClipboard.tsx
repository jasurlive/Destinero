import { useState, useCallback } from "react";

export const useCopyToClipboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = useCallback(
    (value: string | number[] | [number, number]) => {
      const text = Array.isArray(value)
        ? `[${value.join(", ")}]`
        : value.toString();

      navigator.clipboard.writeText(text);
      setCopySuccess(true);

      setTimeout(() => setCopySuccess(false), 1500); // reset after 1.5s
    },
    []
  );

  return { copyToClipboard, copySuccess };
};
