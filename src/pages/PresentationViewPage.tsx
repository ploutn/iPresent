// src/pages/PresentationViewPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { PresentationView } from "../components/presentation/PresentationView"; // Assuming this component will be used or adapted

export function PresentationViewPage() {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch presentation data based on id
  // For now, we can pass a mock or indicate loading

  if (!id) {
    return <div>Error: Presentation ID not found.</div>;
  }

  return (
    <div className="h-screen w-screen bg-black">
      {/* <PresentationView /> will eventually take presentation data based on ID */}
      <PresentationView className="h-full w-full" />
      {/* Placeholder content until PresentationView is fully integrated with routing and data fetching */}
      {/* <div className="h-full flex items-center justify-center text-white">
        <h1 className="text-4xl">Viewing Presentation: {id}</h1>
        <p>(Full presentation content will be here)</p>
      </div> */}
    </div>
  );
}
