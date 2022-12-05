import React, { FC, useState } from "react";
import { Project as ProjectComponent } from "../components/Projects";
import { createProject } from "../services/projectService";
import { Project } from "../types";

export const Home: FC<{ setProjects: Function; projects: Project[] }> = ({
  setProjects,
  projects,
}) => {
  const [name, setName] = useState("");

  const handleCreate = (e: any) => {
    e.preventDefault();
    if (!name) return;
    setProjects(createProject(name));
    setName("");
  };

  return (
    <div className="projects">
      <div className="projects__form">
        <form>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
          <button onClick={(e) => handleCreate(e)}>Create</button>
        </form>
        <div className="projects__search">Search</div>
      </div>
      <h1 className="projects__title">Projects:</h1>

      <ul className="container projects__container">
        {projects &&
          projects.map((project) => <ProjectComponent project={project} />)}
      </ul>
    </div>
  );
};
