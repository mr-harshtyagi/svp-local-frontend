"use-client";
import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useRef } from "react";

import { getTempData, getAccData } from "@/helpers/data";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { labStatus } from "@/constants/labStatus";

import Snackbar from "@/components/snackbar";

import { useRouter } from "next/router";
import ChartsData from "@/components/lab/chartsData";
import ControlPanel from "@/components/lab/controlPanel";

import { socketUrl } from "@/constants/constants";

const inter = Inter({ subsets: ["latin"] });

let experimentData = [];
let dataRecordStatusVar = "start";
let holdDataCheckedVar = false;

export default function Home() {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);

  const [socket, setSocket] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success"); // ["success", "warning", "error"]

  const [motorSpeed, setMotorSpeed] = useState(0); // motor speed
  const [smaValue, setSmaValue] = useState(0); // motor speed
  const [mrValue, setMrValue] = useState(0); // motor speed
  const [dataRecordStatus, setDataRecordStatus] = useState("start"); // recording status

  const [tempData, setTempData] = useState(getTempData()); // temperature data
  const [accData, setAccData] = useState(getAccData()); // acceleration data
  const [experimentStatus, setExperimentStatus] = useState("healthy"); // experiment status ["start", "recording", "done"

  const [holdDataChecked, setHoldDataChecked] = useState(false); // hold data checkbox

  const [checked, setChecked] = useState(false);

  const resetConstraints = () => {
    socket.emit("svpClientMessage", {
      mrValue: 0,
      smaValue: 0,
      motorSpeed: 0,
    });
    setSmaValue(0);
    setMrValue(0);

    setTimeout(() => {
      setMotorSpeed(0);
      setChecked(false);
    }, 1000);
  };

  const handleConstraintOffChange = (event) => {
    if (event.target.checked) {
      resetConstraints();
    }
    setChecked(event.target.checked);
  };

  const handleHoldDataChecked = (event) => {
    setHoldDataChecked(event.target.checked);
    holdDataCheckedVar = event.target.checked;
  };

  const handleMotorSpeed = (event, newValue) => {
    setMotorSpeed(newValue);
    socket.emit("svpClientMessage", {
      mrValue: mrValue,
      smaValue: smaValue,
      motorSpeed: newValue,
    });
  };

  const handleActivateSMA = (event, newValue) => {
    setSmaValue(newValue);
    socket.emit("svpClientMessage", {
      mrValue: mrValue,
      smaValue: newValue,
      motorSpeed: motorSpeed,
    });
  };

  const handleActivateMR = (event, newValue) => {
    setMrValue(newValue);
    socket.emit("svpClientMessage", {
      mrValue: newValue,
      smaValue: smaValue,
      motorSpeed: motorSpeed,
    });
  };

  function establishSocketConnection() {
    console.log("Establishing socket connection...");
    const newSocket = io(socketUrl, {
      auth: {
        token: "frontend-user",
        type: "frontend-client",
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server...", newSocket.id, newSocket.connected);
      setSocketConnected(true);
      setSocket(newSocket);
    });

    return newSocket;
  }

  // handle experiment status
  useEffect(() => {
    if (experimentStatus === "warning") {
      setMessage(
        "Experiment is above optimal temperature. Please reduce SMA value."
      );
      setSnackbarType("warning");
      setShowSnackbar(true);
    }
    if (experimentStatus === "overheat") {
      resetConstraints();
      setMessage("Experiment is in overheat state. Resetting constraints.");
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [experimentStatus]);

  // establish socket connection
  useEffect(() => {
    const newSocket = establishSocketConnection();
    let buffer = [];
    newSocket.on("svpDataUpdate", (data) => {
      // console.log(data);
      buffer.push(data);
      if (!holdDataCheckedVar) {
        // pop the first element and add the new element
        if (buffer.length === 10) {
          // find average of buffer array values
          // let tempSum = 0;
          // let accSum = 0;
          // buffer.forEach((value) => {
          //   tempSum += value.temp;
          //   accSum += value.acc;
          // });
          setTempData((prevData) => {
            const newData = prevData.slice(1);
            newData.push({ temp: data.temp });
            return newData;
          });
          setAccData((prevData) => {
            const newData = prevData.slice(1);
            newData.push({ acceleration: data.acc });
            return newData;
          });
          setExperimentStatus(data.status);
          buffer = [];
        }
        if (dataRecordStatusVar == "recording") {
          console.log("Recording data");
          experimentData.push({
            time: parseFloat(experimentData.length * 0.01).toFixed(2),
            motor: data.motorSpeed,
            sma: data.smaValue,
            mr: data.mrValue,
            acc: data.acc,
            temp: data.temp,
          });
        }
      }
    });
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <>
      <Head>
        <title>SVP Project</title>
        <meta
          name="description"
          content="This is Smart Vibration Platform teaching tool IoT lab."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Snackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        message={message}
        type={snackbarType}
        handleClose={() => setShowSnackbar(false)}
      />

      <main
        className={`flex flex-col justify-between items-center pt-5 mb-5 ${inter.className}`}
      >
        <div className="flex align-middle justify-evenly w-full">
          <h1 className="text-3xl font-bold">SVP (Smart Vibration Platform)</h1>
          {/* Record Data Button */}
          {/* {labStatus && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {dataRecordStatus === "start" ? (
                  <button
                    variant="contained"
                    type="success"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200"
                    onClick={() => {
                      setDataRecordStatus("recording");
                      dataRecordStatusVar = "recording";
                    }}
                  >
                    Record Data
                  </button>
                ) : dataRecordStatus === "recording" ? (
                  <button
                    variant="contained"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200"
                    onClick={() => {
                      setDataRecordStatus("done");
                      dataRecordStatusVar = "done";
                    }}
                  >
                    Stop Recording
                  </button>
                ) : (
                  <CSVLink
                    data={experimentData}
                    headers={headers}
                    filename="svp_experiment_data.csv"
                  >
                    <button
                      variant="contained"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200"
                      onClick={() => {
                        setDataRecordStatus("start");
                        dataRecordStatusVar = "start";
                      }}
                    >
                      Download Data
                    </button>
                  </CSVLink>
                )}
              </div>
            )} */}
        </div>

        <br />
        {labStatus ? (
          <div className="grid grid-cols-2">
            {/* Control Panel */}
            <ControlPanel
              socketConnected={socketConnected}
              experimentStatus={experimentStatus}
              checked={checked}
              handleConstraintOffChange={handleConstraintOffChange}
              holdDataChecked={holdDataChecked}
              handleHoldDataChecked={handleHoldDataChecked}
              motorSpeed={motorSpeed}
              handleMotorSpeed={handleMotorSpeed}
              smaValue={smaValue}
              handleActivateSMA={handleActivateSMA}
              mrValue={mrValue}
              handleActivateMR={handleActivateMR}
            />
            {/* Charts Data */}
            <ChartsData tempData={tempData} accData={accData} />
          </div>
        ) : (
          <div>
            {" "}
            <div className="font-bold p-40 text-gray-500 flex flex-col gap-3 bg-gray-200 rounded-xl text-center">
              <h2 className="text-3xl">
                Local controls are not accessible at the moment.
              </h2>
              <p className="text-blue-500">
                Contact the lab administrator for more information.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
