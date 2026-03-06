import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InputsPage from "../pages/InputsPage";
import MaterialsPage from "../pages/MaterialsPage";
import BlueprintPage from "../pages/BlueprintPage";
import ResultsHubPage from "../pages/ResultsHubPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputsPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/results" element={<ResultsHubPage />} />
        <Route path="/blueprint" element={<BlueprintPage />} />
      </Routes>
    </BrowserRouter>
  );
}
