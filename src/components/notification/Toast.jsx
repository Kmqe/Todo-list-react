import React from "react";
import "./toast.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Toast = ({ showToast, toastMessage }) => {
  return (
    <div className={`toast ${showToast ? "active" : ""}`}>
      <div className="icon">
        <FontAwesomeIcon icon={faCheck} className="check-icon" />
      </div>
      <h2>{toastMessage}</h2>
    </div>
  );
};

export default React.memo(Toast);
