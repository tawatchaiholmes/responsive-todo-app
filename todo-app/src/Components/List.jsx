import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { gsap } from "gsap"
import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import "./List.css"

function List({
  id,
  name,
  handleCompleted,
  grid,
  removeTodo,
  completed,
  priority,
  backgroundColorHandler,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  //refs
  const todoRef = useRef()
  const nameRef = useRef()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  //Animations
  const animateAndRemove = () => {
    gsap.to(todoRef.current, {
      duration: 0.5,
      opacity: 0,
      y: -20,
      rotationX: 180,
      onComplete: () => {
        removeTodo(id)
      },
    })
  }

  //List items animations
  useEffect(() => {
    gsap.from(nameRef.current, {
      duration: 0.5,
      opacity: 0,
      y: 20,
      rotationX: 180,
      delay: -0.1,
      onComplete: () => {
        gsap.to(nameRef.current, {
          duration: 0.5,
          opacity: 1,
          y: 0,
          rotationX: 0,
        })
      },
    })
  }, [completed])

  return (
    <ListStyled
      className="lists"
      style={style}
      colors={"var(--box-color)"}
      ref={setNodeRef}
      completed={completed}
      priority={priority}
      grid={grid}
      {...attributes}
      {...listeners}
    >
      <li className="todo__text" ref={todoRef} onDoubleClick={animateAndRemove}>
        <p ref={nameRef}>{name}</p>
      </li>
      <div
        className="color-btn"
        onDoubleClick={() => backgroundColorHandler(id)}
      >
        <i className="fa-solid fa-circle"></i>
      </div>
      <div className="complete-btn" onDoubleClick={() => handleCompleted(id)}>
        <i className="bx bxs-check-circle"></i>
      </div>
    </ListStyled>
  )
}

const ListStyled = styled.div`
  background: var(--color-Bg2);
  position: relative;
  .todo__text {
    background: ${props => props.colors};
    padding: 1rem 2rem;
    border-radius: 5px;
    margin-bottom: ${props => (props.grid ? "0" : "1rem")};
    list-style: none;
    border: 1px solid var(--color-Icons3);
    box-shadow: var(--shadow3);
    &:hover {
      cursor: pointer;
    }
    &:active {
      transform: scale(0.98);
    }
    p {
      word-break: break-all;
      font-size: clamp(1rem, 2vw, 1.2rem);
      text-decoration: ${props => (props.completed ? "line-through" : "none")};
      color: ${props =>
        props.completed ? "var(--color-Primary-Green)" : "var(--color-Grey0)"};
    }
  }

  .color-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: clamp(1.6rem, 2vw, 1rem);
    padding: 0.4rem 3rem;
    font-family: inherit;
    align-items: left;
    justify-content: left;
    color: ${props =>
      props.priority ? "var(--priority-color)" : "var(--color-Icons2)"};
  }
  .complete-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: clamp(1.2rem, 2vw, 2rem);
    padding: 0.4rem 0.6rem;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props =>
      props.completed ? "var(--color-Primary-Green)" : "var(--color-Icons2)"};
  }
`

export default List
