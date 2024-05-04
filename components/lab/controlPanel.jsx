import React from "react";
import { Box, Container, FormGroup, Slider } from "@mui/material";
import { Cloud, CloudOff } from "@mui/icons-material";
import { FormControlLabel, Switch } from "@mui/material";
import { Circle } from "@mui/icons-material";

const ControlPanel = ({
  socketConnected,
  experimentStatus,
  checked,
  handleConstraintOffChange,
  holdDataChecked,
  handleHoldDataChecked,
  motorSpeed,
  handleMotorSpeed,
  smaValue,
  handleActivateSMA,
  mrValue,
  handleActivateMR,
}) => {
  return (
    <div>
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: "#cfe8fc",
            borderRadius: "20px",
            padding: "25px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h2 className="text-xl font-semibold bg-slate-300 rounded-lg p-2 h-11">
              Control Panel
            </h2>
            <div className="flex text-center gap-4 ">
              <div>
                <div
                  style={
                    socketConnected
                      ? {
                          color: "green",
                        }
                      : { color: "red" }
                  }
                >
                  {socketConnected ? (
                    <Circle fontSize="large" />
                  ) : (
                    <Circle fontSize="large" />
                  )}
                </div>
                <div className="text-gray-600 text-sm w-20">
                  Socket Connection
                </div>
              </div>

              <div>
                <div
                  className="uppercase text-xl mt-[7px]"
                  style={
                    experimentStatus === "healthy"
                      ? {
                          color: "green",
                        }
                      : experimentStatus === "warning"
                      ? { color: "orange" }
                      : { color: "red" }
                  }
                >
                  {experimentStatus}
                </div>
                <div className="text-gray-600 text-sm w-20">
                  Experiment Status
                </div>
              </div>
              {/* 
              <div>
                <div
                  className="uppercase text-xl mt-[7px]"
                  style={timeLeft > 600 ? { color: "black" } : { color: "red" }}
                >
                  {timeLeft > 0
                    ? `${Math.floor(timeLeft / 60)
                        .toString()
                        .padStart(2, "0")}:${(timeLeft % 60)
                        .toString()
                        .padStart(2, "0")}`
                    : "00:00"}
                </div>
                <div className="text-gray-600 text-sm w-20">Time left</div>
              </div> */}
            </div>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    onChange={handleConstraintOffChange}
                    size="large"
                    color="success"
                  />
                }
                label="Reset Constraints"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={holdDataChecked}
                    onChange={handleHoldDataChecked}
                    size="large"
                    color="secondary"
                  />
                }
                label="Hold Data"
              />
            </FormGroup>
          </div>
          <h3 className="text-lg font-semibold">
            Motor (Speed : {motorSpeed})
          </h3>
          <Slider
            aria-label="Volume"
            value={motorSpeed}
            onChange={handleMotorSpeed}
            disabled={experimentStatus === "overheat"}
          />
          <br />
          {/* <h2>Reduce Vibrations</h2> */}
          <br />
          <h3 className="text-lg font-semibold">
            Activate SMA (Value : {smaValue})
          </h3>
          {/* A button that sends POST request to localhost 5000 */}
          <Slider
            aria-label="Volume"
            value={smaValue}
            onChange={handleActivateSMA}
            disabled={experimentStatus === "overheat"}
          />
          <br />
          <h3 className="text-lg font-semibold">
            Activate MR Fluid (Value : {mrValue})
          </h3>
          <Slider
            aria-label="Volume"
            value={mrValue}
            onChange={handleActivateMR}
            disabled={experimentStatus === "overheat"}
          />
          <br />
          <br />
        </Box>
      </Container>
    </div>
  );
};

export default ControlPanel;
