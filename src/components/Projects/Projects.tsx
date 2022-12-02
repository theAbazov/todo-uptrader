import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { createProject } from "../../services/projectService";
import { Project } from "../../types";
import "./Projects.scss";

export const Projects: FC<{ setProjects: Function; projects: Project[] }> = ({
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
      <form className="projects__form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <button onClick={(e) => handleCreate(e)}>Create</button>
      </form>
      <h1 className="projects__title">Projects:</h1>

      <ul className="container projects__container">
        {projects &&
          projects.map((project) => {
            return (
              <div className="projects__item" key={project.id}>
                <h2>{project.projectName}</h2>

                <div className="projects__stats">
                  {project.data &&
                    project.data.map((status) => {
                      return (
                        <h5 key={status.id}>
                          {status.title.split("").slice(0, 3).join("")}
                          <span>{status.items.length}</span>
                        </h5>
                      );
                    })}
                </div>
                <NavLink
                  to={`/project/${project.id}`}
                  className="projects__item-go"
                >
                  Go to project
                </NavLink>
              </div>
            );
          })}
      </ul>
    </div>
  );
};
