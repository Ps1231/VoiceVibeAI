import React from "react";
import Chart, { Props } from "react-apexcharts";

const state: Props["series"] = [
  {
    name: "Sad",
    data: [11, 6, 15, 32, 34, 20, 10],
  },
  {
    name: "Motivated",
    data: [0, 32, 45, 50, 34, 52, 41],
  },
  {
    name: "Happy",
    data: [20, 40, 28, 51, 62, 80, 40],
  },
  {
    name: "excited",
    data: [10, 30, 28, 41, 62, 40, 20],
  },
  {
    name: "excited",
    data: [10, 30, 28, 41, 62, 40, 20],
  },
];

const options: Props["options"] = {
  chart: {
    type: "area",
    animations: {
      easing: "linear",
      speed: 300,
    },
    sparkline: {
      enabled: false,
    },
    brush: {
      enabled: false,
    },
    id: "basic-bar",
    foreColor: "hsl(var(--nextui-default-800))",
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  xaxis: {
    categories: [
      "7 oct",
      "12 oct",
      "20 oct",
      "22 oct",
      "22 oct",
      "27 oct",
      "30 oct",
      "1 nov",
      "7 nov",
      "10 nov",
    ],
    labels: {
      // show: false,
      style: {
        colors: "hsl(var(--nextui-default-800))",
      },
    },
    axisBorder: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
    axisTicks: {
      color: "hsl(var(--nextui-nextui-default-200))",
    },
  },
  yaxis: {
    labels: {
      style: {
        // hsl(var(--nextui-content1-foreground))
        colors: "hsl(var(--nextui-default-800))",
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: true,
    borderColor: "hsl(var(--nextui-default-200))",
    strokeDashArray: 0,
    position: "back",
  },
  stroke: {
    curve: "smooth",
    fill: {
      colors: ["red"],
    },
  },
  // @ts-ignore
  markers: false,
};

export const Steam = () => {
  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <Chart options={options} series={state} type="area" height={425} />
        </div>
      </div>
    </>
  );
};
