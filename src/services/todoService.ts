import { Comment, Item, Project, Task } from "../types";

class Todo {
  createTodo(projId: number, newTodo: Item) {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (projId === project.id) {
        project.data[0].items.push(newTodo);
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  incrementDevtime() {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      project.data[1].items = project.data[1].items.map((item) => {
        item.devTime += 1;
        return item;
      });
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  deleteCurrentTodo(projId: number, itemId: number) {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (projId === project.id) {
        project.data = project.data.map((board) => {
          board.items = board.items.filter((item) => item.id !== itemId);
          return board;
        });
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  updateTodo(projId: number, itemId: number, newItem: Item) {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (projId === project.id) {
        project.data = project.data.map((board) => {
          board.items = board.items.map((item) =>
            item.id === itemId ? newItem : item,
          );
          return board;
        });
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return projects;
  }

  completeTogle(projId: number, itemId: number, taskId: number) {
    let res: Task[] = [];
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (projId === project.id) {
        project.data = project.data.map((board) => {
          board.items = board.items.map((item) => {
            item.tasks = item.tasks.map((task) => {
              if (item.id === itemId) {
                if (task.id === taskId) {
                  task.completed = !task.completed;
                }
                res.push(task);
              }
              return task;
            });
            return item;
          });
          return board;
        });
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return res;
  }

  commentParent(projId: number, itemId: number, newComment: Comment) {
    let res: Comment[] = [];
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      if (projId === project.id) {
        project.data = project.data.map((board) => {
          board.items = board.items.map((item) => {
            if (item.id === itemId) {
              item.comments.push(newComment);
              res = item.comments;
            }
            return item;
          });
          return board;
        });
      }
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return res;
  }

  commentChild(commentId: string, itemId: number, newComment: Comment) {
    const recourse = (comments: Comment[]) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          comment.comments.push(newComment);
        }
        if (comment.comments.length) {
          comment.comments = recourse(comment.comments);
        }
        return comment;
      });
    };
    let res: Comment[] = [];
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects = projects.map((project) => {
      project.data = project.data.map((board) => {
        board.items = board.items.map((item) => {
          item.comments = recourse(item.comments);
          if (item.id === itemId) {
            res = item.comments;
          }
          return item;
        });
        return board;
      });
      return project;
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    return res;
  }
}

export const {
  createTodo,
  incrementDevtime,
  deleteCurrentTodo,
  updateTodo,
  completeTogle,
  commentChild,
  commentParent,
} = new Todo();
