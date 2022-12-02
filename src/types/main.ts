export interface Item {
  id: number;
  title: string;
  desc: string;
  prior: string;
  comments: Comment[];
  tasks: Task[];
  files?: File[];
  deadline: string;
  created: Date | string;
  devTime: number;
}

export interface File {
  name: string;
  url: string;
}

export interface Task {
  title: string;
  completed: boolean;
  id: number;
}

export interface Comment {
  id: string;
  text: string;
  comments: Comment[];
}

export interface Board {
  id: number;
  title: string;
  items: Item[];
}

export interface Project {
  id: number;
  projectName: string;
  data: Board[];
}
