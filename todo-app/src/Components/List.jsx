import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React from "react"
import "./List.css"

const check = <i class="bx bxs-check-circle"></i>

function List({ id, name, completed, removeTodo }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <li onDoubleClick={() => removeTodo(id)}>
        <p>{name}</p>
      </li>
      <div className="complete-btn">{check}</div>
    </div>
  )
}

export default List
