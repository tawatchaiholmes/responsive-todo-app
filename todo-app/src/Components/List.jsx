import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { gsap } from "gsap"
import React, { useEffect, useMemo, useRef } from "react"
import styled from "styled-components"
import "./List.css"

function List({ id, name, handleCompleted, grid, removeTodo, completed }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  //refs
  const todoRef = useRef()
  const nameRef = useRef()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  //Randomize colors
  const randomColors = [
    "var(--button-Gradient1)",
    "var(--button-Gradient2)",
    "var(--button-Gradient3)",
    "var(--button-Gradient4)",
    "var(--button-Gradient5)",
    "var(--button-Gradient6)",
    "var(--button-Gradient7)",
    "var(--button-Gradient8)",
    "var(--button-Gradient9)",
    "var(--button-Gradient10)",
    "var(--button-Gradient11)",
    "var(--button-Gradient12)",
    "var(--button-Gradient13)",
    "var(--button-Gradient14)",
  ]

  //Randomize
  const randomizeColors = () => {
    const randomColor =
      randomColors[Math.floor(Math.random() * randomColors.length)]

    return randomColor
  }

  //useMemo
  const randomColorMemo = useMemo(() => {
    return randomizeColors()
  }, [])

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
      colors={randomColorMemo}
      ref={setNodeRef}
      completed={completed}
      grid={grid}
      {...attributes}
      {...listeners}
    >
      <li className="todo__text" ref={todoRef} onDoubleClick={animateAndRemove}>
        <p ref={nameRef}>{name}</p>
      </li>
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

  .complete-btn {
    color: ${props =>
      props.completed ? "var(--color-Primary-Green)" : "var(--color-Icons2)"};
  }
`

export default List
