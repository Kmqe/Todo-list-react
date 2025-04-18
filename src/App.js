import './App.css';
import { useEffect, useReducer, useState } from "react";
// Import uniqueId function to generate unique IDs
import { v4 as uniqueId } from "uuid";
// Import useTranslation hook for translations
import { useTranslation } from 'react-i18next';
// Import FontAwesomeIcon to use icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ConfirmAction from "./components/confirmAction/ConfirmAction.jsx";
import Toast from './components/notification/Toast.jsx';

function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("en")

  const [inputValue, setInputValue] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang])

  let initialValue = {
    tasks: [], // Array to store tasks when entered, and to keep tasks after page reload
    targetTaskInfo: {}, // Stores info about the selected task (id, title) and popup type (edit/delete)
    showPopup: false,
  }
  const [state, dispatch] = useReducer(reducer, initialValue)

  function reducer(state, { type, payload }) {
    switch (type) {
      case "ADD_TASKS": {
        return { ...state, tasks: payload }
      }
      case "TASK_DATA": {
        return { ...state, targetTaskInfo: payload }
      }
      case "POPUP_DISPLAY": {
        return { ...state, showPopup: payload }
      }
      default: {
        return state;
      }
    }
  }

  function changeLang() {
    if (lang === "en") {
      setLang("ar")
    }
    else {
      setLang("en")
    }
  }

  // // Adds a new task to localStorage by creating a unique ID and updating the existing task list
  function addTaskToStorage() {
    if (inputValue === "" || inputValue === null) return;
    setShowToast(true);
    setToastMessage(t("Task added successfully"));
    let tasks = [];
    // If tasks exist in localStorage, retrieve them and add the new task to the array
    if (localStorage.getItem("tasks")) {
      tasks = JSON.parse(localStorage.getItem("tasks"))
      // // When the Add button is clicked, create a new task and add it to the tasks array
      tasks.push({ title: inputValue, id: uniqueId() })
      dispatch({ type: "ADD_TASKS", payload: tasks })
    }
    // If there are no tasks in localStorage, create a new array with the new task
    else {
      tasks = [{ title: inputValue, id: uniqueId() }];
      dispatch({ type: "ADD_TASK", payload: tasks })
    }
    // Store Tasks in LocalStorage
    localStorage.setItem("tasks", JSON.stringify(tasks))
    // Clear the input field after adding the task
    setInputValue("")
  }

  function editTask(title, id) {
    dispatch({ type: "TASK_DATA", payload: { id: id, title: title, popupType: "edit" } })
    dispatch({ type: "POPUP_DISPLAY", payload: true });
  }

  function deleteTask(title, id) {
    dispatch({ type: "TASK_DATA", payload: { id: id, title: title, popupType: "delete" } })
    dispatch({ type: "POPUP_DISPLAY", payload: true });
  }

  // On component mount or when a new task is added, load tasks from localStorage and update state
  useEffect(() => {
    if (localStorage.getItem("tasks")) {
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      dispatch({ type: "ADD_TASKS", payload: tasks })
    }
  }, []);

  // Hide toast automatically after showing it
  useEffect(() => {
    if (showToast === true) {
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }
  }, [showToast])

  return (
    <div className={`app ${lang === "ar" ? "ar" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"} >
      {state.showPopup ? <ConfirmAction states={[state, dispatch]} toast={[setShowToast, setToastMessage]} lang={lang} /> : null}
      <Toast showToast={showToast} toastMessage={toastMessage} lang={lang} />
      <h1>{t("To-Do List 📋")}</h1>

      {/* Input and Button to Add New Task */}
      <div className="box-adding">
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} maxLength={40} />
        <button onClick={() => { addTaskToStorage() }}>{t("ADD")}</button>
      </div>

      {/* UI OF TASKS */}
      <div className="list">
        <ul>
          {
            state.tasks ?
              state.tasks.map(task => {
                return (
                  <li className="task" key={task.id}>
                    <h3>{task.title}</h3>
                    <div className="icons">
                      <div className="update icon" onClick={() => editTask(task.title, task.id)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </div>
                      <div className="delete icon" onClick={() => deleteTask(task.title, task.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </div>
                    </div>
                  </li>)
              })
              : ""
          }
        </ul>
      </div>
      <button onClick={() => changeLang()} className="btn-language">{t("ar")}</button>
    </div>
  );
}

export default App;








// const initialValue = {
//   task: "",
//   tasks: [],
//   targetTaskInfo: {},
//   action: "",
// }

// function reducer(state, action) {

// }

// const [state, dispatch] = useReducer(reducer, initialValue)
