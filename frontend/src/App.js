import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DashboardPreview from "./components/DashboardPreview";
import Pricing from "./components/Pricing";
import Support from "./components/Support";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <DashboardPreview />
      <Pricing />
      <Support />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;