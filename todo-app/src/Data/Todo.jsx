import { v4 as uuid } from "uuid"

export const myTodo = [
  {
    id: uuid(),
    name: "Demo1",
    completed: false,
  },
  {
    id: uuid(),
    name: "Demo2",
    completed: false,
  },
  {
    id: uuid(),
    name: "Demo3",
    completed: false,
  },
]

export default myTodo
