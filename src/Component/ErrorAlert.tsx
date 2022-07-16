import { XCircleIcon, XIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";

export default function ErrorAlert(props) {
  const errorMsg = props.errorMsg;

  const dismissError = () => {
    document.getElementById("error-alert-cont")!!.style.display = "none";
    props.dismiss("");
  };

  useEffect(() => {
    if (errorMsg === "") {
      document.getElementById("error-alert-cont")!!.style.display = "none";
    }
  }, []);

  return (
    <div className="rounded-md bg-red-50 p-4" id="error-alert-cont">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-700" id="error-msg">
            {errorMsg}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              id="dismiss-btn"
              onClick={dismissError}
              type="button"
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
