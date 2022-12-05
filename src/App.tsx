import React, { FC, useEffect, useState } from "react";
import "./App.scss";
import { Project } from "./types";
import { Route, Routes } from "react-router-dom";
import { incrementDevtime } from "./services/todoService";
import { BoardsPage } from "./pages/BoardsPage";
import { Home } from "./pages/Home";

const App: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let storage = JSON.parse(localStorage.getItem("projects")!);
    if (!storage) {
      localStorage.setItem("projects", JSON.stringify([]));
      storage = JSON.parse(localStorage.getItem("projects")!);
    }
    if (!projects.length && storage.length) setProjects(storage);
  }, [projects]);

  useEffect(() => {
    const intervalId = setInterval(incrementDevtime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Home projects={projects} setProjects={setProjects} />}
        />
        <Route
          path="/project/:projectId"
          element={<BoardsPage setProjects={setProjects} projects={projects} />}
        />
      </Routes>
    </div>
  );
};

export default App;
