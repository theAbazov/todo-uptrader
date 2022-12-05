import { Board, Item, Project } from "../types";
import { initialBoard } from "./dndService";

export class ProjectService {
  createProject(name: string) {
    const projects = JSON.parse(localStorage.getItem("projects")!);
    const newProject: Project = {
      id: projects.length ? projects![projects!.length - 1].id + 1 : 1,
      projectName: name,
      data: initialBoard,
    };
    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  editProject(name: string, id: number) {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (project.id === id) {
        project.projectName = name;
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  removeProject(id: number) {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.filter((project) => project.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  searchTodo(name: string) {
    const search = Number.isNaN(+name) ? name : +name;
    const result: Item[] = [];
    const projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects.map((project: Project) =>
      project.data.forEach((borad: Board) =>
        borad.items.forEach((item: Item) => {
          if (item.id === search || item.title === search) {
            result.push(item);
          }
        }),
      ),
    );
    return result;
  }
}

export const { createProject, editProject, removeProject } =
  new ProjectService();
