import React from "react";
import FiltersForm from "./components/filters-form";
import BusCard from "./components/bus-card";
import BottomAdStack from "../components/BottomAdStack";

const Home = () => {
  return (
    <div className="flex flex-col gap-3">
      <FiltersForm />

      {Array.from({ length: 20 }).map((_, i) => (
        <BusCard key={i} />
      ))}

      {/* Bottom Ads Mobile */}
      <BottomAdStack />
    </div>
  );
};

export default Home;
