import { Board, Item } from "../types/main";

class dndService {
  private initBoard: Board[];
  constructor(init: Board[]) {
    this.initBoard = init;
  }

  public get initialBoard(): Board[] {
    return this.initBoard;
  }

  onDropBoard(
    board: Board,
    currentItem: Item,
    currentBoard: Board,
    boards: Board[]
  ) {
    board!.items.push(currentItem);
    const currentIndex = currentBoard!.items!.indexOf(currentItem!);
    currentBoard?.items!.splice(currentIndex, 1);
    return boards!.map((b) => {
      if (b.id === board.id) {
        return board;
      }
      if (b.id === currentBoard!.id) {
        return currentBoard;
      }
      return b;
    });
  }

  onDrop(
    board: Board,
    item: Item,
    currentBoard: Board,
    currentItem: Item,
    boards: Board[]
  ) {
    const currentIndex = currentBoard!.items!.indexOf(currentItem!);
    currentBoard?.items!.splice(currentIndex, 1);
    const dropIndex = board!.items.indexOf(item!);
    board.items.splice(dropIndex, 0, currentItem);
    return boards!.map((b) => {
      if (b.id === board.id) {
        return board;
      }
      if (b.id === currentBoard!.id) {
        return currentBoard;
      }
      return b;
    });
  }

  onOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.className === "item") {
      e.target.style.boxShadow = "0 4px 3px red";
    }
  }

  onEnd(e: any) {
    e.stopPropagation();
    e.target.style.boxShadow = "none";
  }

  onLeave(e: any) {
    e.stopPropagation();
    e.target.style.boxShadow = "none";
  }
}

const init: Board[] = [
  {
    id: 1,
    title: "Queue",
    items: [
      // {
      //   id: 1,
      //   title: "TODOLIST 222",
      //   desc: {
      //     text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur cumque dolorem similique minima adipisci eligendi voluptas voluptatum ut saepe laudantium!",
      //     html: "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur cumque dolorem similique minima adipisci eligendi voluptas voluptatum ut saepe laudantium!</p>",
      //   },
      //   prior: "high",
      //   tasks: [
      //     { title: "Dnd", completed: true, id: 1 },
      //     { title: "UI", completed: false, id: 2 },
      //   ],
      //   deadline: "23-12-2022",
      //   devTime: 0,
      //   created: new Date(),
      //   files: [],
      //   comments: [
      //     {
      //       text: "lorem lorem lorem lorem",
      //       comments: [{ text: "asdfsgevsdfwerqwterg", comments: [] }],
      //     },
      //   ],
      // },
    ],
  },
  {
    id: 2,
    title: "Development",
    items: [],
  },
  {
    id: 3,
    title: "Done",
    items: [],
  },
];

export const { onDrop, initialBoard, onEnd, onLeave, onDropBoard, onOver } =
  new dndService(init);
