import React from "react";
import {
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box } from "@mui/material";

const ChartsData = ({ tempData, accData }) => {
  return (
    <div className="">
      <Box
        sx={{
          bgcolor: "#cfe8fc",
          height: "100vh",
          borderRadius: "20px",
          padding: "15px",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {" "}
          <h3 className="text-xl font-semibold bg-slate-300 rounded-lg p-2">
            Temperature data
          </h3>
          <div className="ml-4">
            <p> Y axis -{">"} Temperature (in Celsius)</p>
            <p> X axis -{">"} 10 sec Timeframe</p>
          </div>
        </div>

        <br />
        <ResponsiveContainer width="100%" height="30%">
          <AreaChart
            width={500}
            height={200}
            data={tempData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3" />
            <YAxis dataKey="temp" domain={[20, 80]} />
            <Tooltip />
            <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
        <br />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {" "}
          <h3 className="text-xl font-semibold bg-slate-300 rounded-lg p-2">
            Accelerometer data
          </h3>
          <div className="ml-4">
            <p> Y axis -{">"}Acceleration (in m/s^2)</p>
            <p> X axis -{">"} 10 sec Timeframe</p>
          </div>
        </div>

        <br />
        <ResponsiveContainer width="100%" height="30%">
          <AreaChart
            width={500}
            data={accData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3" />

            <YAxis dataKey="acceleration" domain={[-12, 12]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="acceleration"
              stroke="#8884d8"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default ChartsData;
