import React, { FC, useEffect, useState } from "react";
import "./App.scss";
import { Project } from "./types";
import { Route, Routes } from "react-router-dom";
import { Projects } from "./components/Projects";
import { Boards } from "./components/Boards";

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

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Projects projects={projects} setProjects={setProjects} />}
        />
        <Route
          path="/project/:projectId"
          element={<Boards setProjects={setProjects} projects={projects} />}
        />
      </Routes>
    </div>
  );
};

export default App;
