import { DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { gsap } from "gsap"
import React, { useEffect, useRef, useState } from "react"
import uuid from "react-uuid"
import styled from "styled-components"
import "./App.css"
import List from "./Components/List"
import { myTodo } from "./Data/Todo"

const horizonGrid = <i className="fa-solid fa-table-columns"></i>
const verticalGrid = <i className="fa-solid fa-list-ul"></i>

function App() {
  const [todo, setTodo] = useState(myTodo)
  const [value, setValue] = useState("")
  const [toggleGrid, setToggleGrid] = useState(false)

  //refs
  const todoRef = useRef()
  const todoCon = useRef()
  const formRef = useRef()

  //Save to Local storage
  const saveToLocalStorage = todo => {
    if (todo) {
      localStorage.setItem("todo", JSON.stringify(todo))
    }
  }

  //Delete from local storage
  const deleteFromLocalStorage = id => {
    const filtered = todo.filter(todo => {
      return todo.id !== id
    })

    localStorage.setItem("todo", JSON.stringify(filtered))
  }

  //Retrieve from local storage
  useEffect(() => {
    const localTodo = localStorage.getItem("todo")
    if (localTodo) {
      setTodo(JSON.parse(localTodo))
    }

    //Grid from local storage
    const localGrid = localStorage.getItem("toggleGrid")
    if (localGrid) {
      setToggleGrid(JSON.parse(localGrid))
    }
  }, [])

  //Set the value
  const handleChange = e => {
    setValue(e.target.value)
  }

  //Handle Todo Submit
  const handleSubmit = e => {
    e.preventDefault()

    if (!value || value.length < 3) {
      return alert("Input value must be at least 3 characters")
    } else if (value.length > 80) {
      return alert("Input value must be at most 80 characters")
    }

    const newTodo = [
      ...todo,
      {
        id: uuid(),
        name: value,
        completed: false,
        priority: false,
      },
    ]
    setTodo(newTodo)
    //Send to local storage
    saveToLocalStorage(newTodo)
    //Clear input field
    setValue("")
  }

  //Remove Todo
  const removeTodo = id => {
    deleteFromLocalStorage(id)
    const filteredTodo = todo.filter(todo => {
      return todo.id !== id
    })

    setTodo(filteredTodo)
  }

  //Set Todo value after dragging
  const handleTodoDrag = e => {
    const { active, over } = e

    if (active.id !== over.id) {
      setTodo(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        //Create new Array of Todo with new order
        const newItems = [...items]

        //Remove item from old index
        newItems.splice(oldIndex, 1)

        //Insert item at the new index
        newItems.splice(newIndex, 0, items[oldIndex])

        return newItems
      })
    }
  }

  //Handle Grid
  const gridHandler = () => {
    setToggleGrid(!toggleGrid)
    localStorage.setItem("toggleGrid", JSON.stringify(!toggleGrid))
  }

  //Handle Background color change
  const backgroundColorHandler = id => {
    const newTodos = todo.map(todo => {
      if (todo.id === id) {
        todo.priority = !todo.priority
      }

      return todo
    })
    setTodo(newTodos)
    saveToLocalStorage(newTodos)
  }

  //Handle Completed
  const handleCompleted = id => {
    const newTodos = todo.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }

      return todo
    })
    setTodo(newTodos)
    saveToLocalStorage(newTodos)
  }

  //Animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power1.out", duration: 1 } })
    tl.fromTo(
      todoRef.current,
      { opacity: 0, x: 800 },
      { opacity: 1, x: 0, duration: 0.5 }
    )
      .fromTo(
        todoCon.current,
        { opacity: 0, y: 800, scale: 0.5 },
        { opacity: 1, y: 0, duration: 0.5, scale: 1 },
        "-=0.5"
      )
      .fromTo(
        formRef.current,
        { opacity: 0, y: -800, scaleX: 0 },
        { opacity: 1, y: 0, duration: 0.5, scaleX: 1 },
        "-=0.1"
      )
  }, [])

  return (
    <AppStyled grid={toggleGrid}>
      <form ref={formRef} action="" onSubmit={handleSubmit} className="form">
        <h1>Today's Tasks</h1>
        <div className="input-container">
          <input
            className="input"
            value={value}
            onChange={handleChange}
            placeholder="Add a Task"
          />
          <div className="submit-btn">
            <button>+ Add Todo</button>
          </div>
        </div>
      </form>

      <DndContext onDragEnd={handleTodoDrag}>
        <SortableContext items={todo.map(todo => todo.id)}>
          <ul ref={todoCon} className="todo-container">
            <div className="priority-container">
              <div className="toggle-grid">
                <button onClick={gridHandler}>
                  {toggleGrid ? verticalGrid : horizonGrid}
                </button>
              </div>
              <p>
                <strong>Priority</strong>
              </p>
              <p>High</p>
            </div>
            <div ref={todoRef} className="todos">
              {todo.map(todo => {
                const { id, name, completed, priority } = todo
                return (
                  <List
                    key={id}
                    id={id}
                    name={name}
                    grid={toggleGrid}
                    completed={completed}
                    priority={priority}
                    removeTodo={removeTodo}
                    handleCompleted={handleCompleted}
                    backgroundColorHandler={backgroundColorHandler}
                  />
                )
              })}
            </div>
            <div className="bottom">
              <div className="low hide">
                <p>Low</p>
              </div>
              <div className="tooltips">
                <i class="fa-regular fa-circle-question"></i>
                <div className="content">
                  <h3> How to </h3>
                  <p>
                    <b>Add</b> - Click on Add todo
                  </p>
                  <p>
                    <b>Delete</b> - Double click on the text
                  </p>
                  <p>
                    <b>Complete</b> - Double click on Check Icon
                  </p>
                  <p>
                    <b>Priority</b> - Double click on Circle Icon
                  </p>
                  <p>
                    <b>Drag 'n Drop</b> - Press and drag
                  </p>
                </div>
              </div>
              <div className="low">
                <p>Low</p>
              </div>
            </div>
          </ul>
        </SortableContext>
      </DndContext>
    </AppStyled>
  )
}

const AppStyled = styled.div`
  .todos {
    display: ${props => (props.grid ? "grid" : "")};
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    grid-column-gap: 1rem;
    transition: all 0.4s ease;
    grid-row-gap: ${props => (props.grid ? "1rem" : "0")};
  }
`

export default App
