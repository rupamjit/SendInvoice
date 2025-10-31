
import { Suspense } from "react";
import ErrorContent from "./error-content";


export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div>Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
