import {ReactNode} from "react";

export function LoadingSpinner(): ReactNode {
  return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
