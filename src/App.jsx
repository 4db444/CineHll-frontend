import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import BaseLayout from "./Layouts/BaseLayout";

export default function App () {

  return <BrowserRouter>
    <Routes>
      <Route element={<BaseLayout />} >
        <Route path="/" element={<LandingPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
}