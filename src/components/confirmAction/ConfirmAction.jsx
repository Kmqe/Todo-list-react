import "./confirm.css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ConfirmAction = ({ states, toast, lang }) => {
  const { t } = useTranslation();
  // Show toast notification after updating the task
  let [setShowToast, setToastMessage] = toast;

  let [state, dispatch] = states;
  // Extract the tasks array from the state
  const tasks = state.tasks;
  const showPopup = state.showPopup;
  const { id, title, popupType } = state.targetTaskInfo;

  const [taskTitle, setTaskTitle] = useState(title);
  // This function deletes a specific task from localStorage
  function deleteTaskFromStore() {
    // Filter out the task that matches the given id
    let updateTasks = tasks.filter((task) => {
      return task.id !== id ? task : "";
    });
    // Save the updated tasks array to localStorage
    localStorage.setItem("tasks", JSON.stringify(updateTasks));
    // Update the state with the new list of tasks
    dispatch({ type: "ADD_TASKS", payload: updateTasks });
    // Close the confirmation popup after deleting
    dispatch({ type: "POPUP_DISPLAY", payload: false });
    // Show toast notification with message
    setToastMessage(t("The task has been successfully removed"));
    setShowToast(true);
  }

  // Function to edit the title of a specific task in localStorage
  function editTaskFromStore() {
    // Map through tasks and update the title of the matching task
    let updateTasks = tasks.map((task) => {
      if (task.id === id) {
        task.title = taskTitle;
      }
      return task;
    });
    // Save the updated tasks array to localStorage
    localStorage.setItem("tasks", JSON.stringify(updateTasks));
    // Update the state with the new list of tasks
    dispatch({ type: "ADD_TASKS", payload: updateTasks });
    // Close the confirmation popup after Editing
    dispatch({ type: "POPUP_DISPLAY", payload: false });
    // Show toast notification with message
    setToastMessage(t("Task updated successfully"));
    setShowToast(true);
  }

  // Check if the popup is for editing a task
  if (showPopup === false) {
    return;
  } else if (popupType === "edit") {
    return (
      <div className={`confirm ${lang === "ar" ? "ar" : ""}`}>
        <div className="container">
          <h1>{t("Please confirm change")}</h1>

          <input
            maxLength={40}
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="buttons">
            <button
              className="close"
              onClick={() =>
                dispatch({ type: "POPUP_DISPLAY", payload: false })
              }
            >
              {t("Close")}
            </button>
            <button className="change" onClick={() => editTaskFromStore()}>
              {t("change")}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // Popup for deleting a task
    return (
      <div className={`confirm ${lang === "ar" ? "ar" : ""}`}>
        <div className="container">
          <h1>{t("Please confirm deletion")}</h1>
          <p>
            {t("You are about to delete")}: "{title}"
          </p>
          <div className="buttons">
            <button
              className="close"
              onClick={() =>
                dispatch({ type: "POPUP_DISPLAY", payload: false })
              }
            >
              {t("Close")}
            </button>
            <button className="delete" onClick={() => deleteTaskFromStore()}>
              {t("Delete")}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ConfirmAction;
