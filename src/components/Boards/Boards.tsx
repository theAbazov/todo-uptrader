import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Board, Project } from "../../types";
import "./Boards.scss";
import { Item } from "../../types/main";
import { secondsToHours, millisecondsToHours } from "date-fns";
import { TaskDetail } from "../TaskDetail";
import {
  onDrop,
  onDropBoard,
  onEnd,
  onLeave,
  onOver,
} from "../../services/dndService";
import { editProject, removeProject } from "../../services/projectService";
import Create from "../CreateTaskModal/Create";

const EditProjectName: FC<{
  setModal: Function;
  setProjects: Function;
  id: number;
}> = ({ setModal, setProjects, id }) => {
  const [newName, setNewName] = useState("");

  const handleEdit = (e: any) => {
    e.preventDefault();
    if (!newName) return;
    setProjects(editProject(newName, id));
    setModal("");
    setNewName("");
  };

  return (
    <form
      onSubmit={(e) => handleEdit(e)}
      onClick={() => setModal(false)}
      className="editProject"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="editProject__content"
      >
        <input
          value={newName}
          type="text"
          autoFocus
          onChange={(e) => setNewName(e.target.value)}
        />
        <button>Edit</button>
      </div>
    </form>
  );
};

export const Boards: FC<{ setProjects: Function; projects: Project[] }> = ({
  setProjects,
  projects,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [boards, setBoards] = useState<Board[]>();
  const [projectName, setProjName] = useState("");

  // modal states
  const [modal, setModal] = useState<string>("");
  const [currentDetail, setCurrentDetail] = useState<Item>();
  const [projectModal, setProjectModal] = useState(false);
  // modal states

  //DnD states
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  //DnD states

  useEffect(() => {
    const projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects.forEach((proj) => {
      if (proj.id === +projectId!) {
        setBoards(proj.data);
        setProjName(proj.projectName);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // DnD actions start
  const handleMore = (item: Item) => {
    setCurrentDetail(item);
    setModal("detail");
  };

  const handleStart = (e: any, board: Board, item: Item) => {
    e.stopPropagation();
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const handleDrop = (e: any, board: Board, item: Item) => {
    e.stopPropagation();
    e.preventDefault();
    setBoards(onDrop(board, item, currentBoard!, currentItem!, boards!));
  };

  const handleDropBoard = (e: any, board: Board) => {
    e.preventDefault();
    setBoards(onDropBoard(board!, currentItem!, currentBoard!, boards!));
  };

  const saveEffect = () => {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);

    if (boards) {
      projects = projects.map((project) => {
        if (project.id === +projectId!) {
          project.data = boards!;
        }
        return project;
      });
    }
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  useEffect(saveEffect, [boards, projectId]);
  // DnD actions end

  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    const conf = confirm("Are you sure to delete this project?");
    if (!conf) return;
    setProjects(removeProject(+projectId!));
    navigate("/");
  };

  return (
    <div className="desks">
      {projectModal && (
        <EditProjectName
          setModal={setProjectModal}
          setProjects={setProjects}
          id={+projectId!}
        />
      )}
      {modal === "detail" ? (
        <TaskDetail
          setProjects={setProjects}
          setModal={setModal}
          data={currentDetail}
          projectId={+projectId!}
        />
      ) : modal === "create" ? (
        <Create
          type="Create"
          setProjects={setProjects}
          setModal={setModal}
          projectId={+projectId!}
          item={undefined}
        />
      ) : modal === "edit" ? (
        <Create
          type="Edit"
          setProjects={setProjects}
          setModal={setModal}
          projectId={+projectId!}
          item={currentDetail}
        />
      ) : null}
      <div className="desks__header">
        <div className="desks__header-start">
          <h1 className="desks__header-title">{projectName}</h1>
          <button
            onClick={() => setProjectModal(true)}
            className="desks__header-edit btns"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="desks__header-delete btns">
            Delete
          </button>
        </div>
      </div>
      <div className="desks-content">
        {boards &&
          boards.map((board) => {
            return (
              <div
                onDrop={(e) => handleDropBoard(e, board)}
                onDragOver={onOver}
                key={board.id}
                className="board desk__board"
              >
                <h2 className="board__title">
                  {board.title}
                  {board.id === 1 ? (
                    <button
                      style={{
                        marginLeft: "50px",
                        padding: "5px 10px",
                        background: "green",
                      }}
                      onClick={() => setModal("create")}
                    >
                      +
                    </button>
                  ) : null}
                </h2>
                <ul className="item-wapper">
                  {board.items.map((item) => {
                    const isDead = Date.parse(item.deadline) - Date.now() < 0;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragOver={onOver}
                        onDragLeave={onLeave}
                        onDragStart={(e) => handleStart(e, board, item)}
                        onDragEnd={onEnd}
                        onDrop={(e) => handleDrop(e, board, item)}
                        className="board__item item"
                        style={{
                          borderColor:
                            isDead && board.id !== 3 ? "red" : "#30363d",
                        }}
                      >
                        <div className="item__head">
                          <h3 className="item__title">
                            <span
                              className="indicator"
                              style={{ background: prior(item.prior) }}
                            ></span>
                            {item.title}
                            <span className="item__title-taskcount">
                              {item.tasks.length}
                            </span>
                          </h3>
                          <div className="item__deadline">{item.deadline}</div>
                        </div>
                        <div className="item__body">
                          <div>
                            <p>Files: {item.files?.length}</p>
                            <p>Created: {item.created.toString()}</p>
                          </div>
                          <button
                            className="item__more"
                            onClick={() => handleMore(item)}
                          >
                            More
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const prior = (p: string) => {
  return p === "average" ? "yellow" : p === "high" ? "red" : "green";
};
// import React, { FC, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Board, Item, setFn } from "../../types/main";

// const init: Board[] = [
//   {
//     id: 1,
//     title: "Queue",
//     items: [
//       { id: 1, title: "To do list" },
//       { id: 2, title: "Aviasales" },
//       { id: 3, title: "TMDB" },
//     ],
//   },
//   {
//     id: 2,
//     title: "Queue",
//     items: [
//       { id: 3, title: "currency" },
//       { id: 4, title: "KinoPoisk" },
//       { id: 5, title: "ZEON" },
//     ],
//   },
//   {
//     id: 3,
//     title: "Queue",
//     items: [
//       { id: 7, title: "React Dnd" },
//       { id: 8, title: "top" },
//       { id: 9, title: "requestAnimationFrame" },
//     ],
//   },
// ];

// export const Desks: FC = () => {
//   const [boards, setBoards] = useState<Board[] | setFn | false>(false);

//   const { projectName: name } = useParams();

//   const [currentBoard, setCurrentBoard] = useState<Board>();
//   const [currentItem, setCurrentItem] = useState<Item>();
//   const over = (e: any) => {
//     e.preventDefault();
//     if (e.target.className === "item") {
//       e.target.style.boxShadow = "0 4px 3px gray";
//     }
//   };
//   const end = (e: any) => {
//     e.target.style.boxShadow = "none";
//   };
//   const leave = (e: any) => {
//     e.target.style.boxShadow = "none";
//   };
//   const start = (e: any, board: any, item: any) => {
//     setCurrentBoard(board);
//     setCurrentItem(item);
//   };

//   const drop = (e: any, board: any, item: any) => {
//     e.stopPropagation();
//     e.preventDefault();
//     const currentIndex = currentBoard!.items!.indexOf(currentItem!);
//     currentBoard?.items!.splice(currentIndex, 1);
//     const dropIndex = board!.items.indexOf(item!);
//     board.items.splice(dropIndex, 0, currentItem);
//     setBoards(
//       Array.isArray(boards) &&
//         boards!.map((b) => {
//           if (b.id === board.id) {
//             return board;
//           }
//           if (b.id === currentBoard!.id) {
//             return currentBoard;
//           }
//           return b;
//         })
//     );
//     e.target.style.boxShadow = "none";
//   };

//   const dropBoard = (e: any, board: any) => {
//     board!.items.push(currentItem);
//     const currentIndex = currentBoard!.items!.indexOf(currentItem!);
//     currentBoard?.items!.splice(currentIndex, 1);
//     setBoards(
//
//     );
//   };
//   useEffect(() => {
//     let dnd = JSON.parse(localStorage.getItem("dnd")!);
//     if (!dnd) {
//       localStorage.setItem("dnd", JSON.stringify(init));
//       dnd = JSON.parse(localStorage.getItem("dnd")!);
//     }
//     if (!boards) {
//       setBoards(dnd);
//     }
//     return () => {
//       if (boards) {
//         localStorage.setItem("dnd", JSON.stringify(boards));
//       }
//     };
//   }, [boards]);

//   const changeFile = (file: any, iId: any, bId: any) => {
//     const reader = new FileReader();
//     reader.addEventListener("loadend", () => {
//       setBoards((boards: Board[]): Board[] => {
//         return boards.map((board: Board) => {
//           console.log(bId);
//           console.log("file", file);
//           console.log("iId", iId);
//           if (board.id === bId) {
//             board.items.forEach((item) => {
//               if (item.id === iId) {
//                 item.files = item.files?.length
//                   ? [...item.files, reader.result]
//                   : [reader.result];
//               }
//             });
//           }
//           return board;
//         });
//       });
//     });
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="app">
//       {Array.isArray(boards) &&
//         boards.map((board: any) => {
//           console.log(board.id);
//           return (
//             <div
//               key={board.id}
//               className="board"
//               onDrop={(e) => dropBoard(e, board)}
//               onDragOver={over}
//             >
//               <div className="board__title">{board.title}</div>
//               {board &&
//                 board.items.map((item: any) => {
//                   console.log("iId", item.id);
//                   return (
//                     <div
//                       className="item"
//                       key={item.id}
//                       draggable
//                       onDragOver={over}
//                       onDragLeave={leave}
//                       onDragStart={(e) => start(e, board, item)}
//                       onDragEnd={end}
//                       onDrop={(e) => drop(e, board, item)}
//                     >
//                       {item.title}
//                       <br />
//                       <label htmlFor={item.id}> File</label>
//                       {item.files &&
//                         item.files.map((e: any) => (
//                           <>
//                             <a target={"_blank"} rel="noreferrer" href={e}>
//                               List
//                             </a>
//                             <br />
//                           </>
//                         ))}
//                       <input
//                         type="file"
//                         onChange={(e) =>
//                           changeFile(e.target.files![0], item.id, board.id)
//                         }
//                         id={item.id}
//                         hidden
//                       />
//                     </div>
//                   );
//                 })}
//             </div>
//           );
//         })}
//     </div>
//   );
// };
