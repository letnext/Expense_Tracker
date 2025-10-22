import React from "react";
import CategoryLinegraph from "./CategoryLinegraph";
import PieChart from "./PieChart";
import "../styles/ChartsLayout.css";

const ChartsLayout = () => {
  return (
    <div className="charts-layout">
      <div className="chart-box linegraph-section">
        <CategoryLinegraph />
      </div>
      <div className="chart-box piechart-section">
        <PieChart />
      </div>
    </div>
  );
};

export default ChartsLayout;
