import { v4 as uuid } from "uuid"

export const myTodo = [
  {
    id: uuid(),
    name: "Learn React",
    completed: false,
  },
  {
    id: uuid(),
    name: "Learn Firebase",
    completed: false,
  },
  {
    id: uuid(),
    name: "Learn Node",
    completed: false,
  },
]

export default myTodo
