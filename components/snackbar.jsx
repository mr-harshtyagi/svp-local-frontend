import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function ExperimentStatusSnackbar({
  showSnackbar,
  setShowSnackbar,
  message,
  type,
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <div>
      <Snackbar
        open={showSnackbar}
        onClose={handleClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        key={"bottom" + "right"}
        message={message}
        variant="filled"
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
