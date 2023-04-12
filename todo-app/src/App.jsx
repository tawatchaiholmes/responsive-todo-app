import { DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { useState } from "react"
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

  // Set the value
  const handleChange = e => {
    setValue(e.target.value)
  }

  //Handle Todo Submit
  const handleSubmit = e => {
    e.preventDefault()

    if (!value || value.length < 3) {
      return alert("Input value must be at least 3 characters")
    }

    const newTodo = [
      ...todo,
      {
        id: uuid(),
        name: value,
        completed: false,
      },
    ]
    setTodo(newTodo)
    //Clear input field
    setValue("")
  }

  //Remove Todo
  const removeTodo = id => {
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

  // Handle Grid
  const gridHandler = () => {
    setToggleGrid(!toggleGrid)
  }

  // Handle Completed
  const handleCompleted = id => {
    const newTodos = todo.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }

      return todo
    })
    setTodo(newTodos)
  }

  return (
    <AppStyled grid={toggleGrid}>
      <form action="" onSubmit={handleSubmit} className="form">
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
          <ul className="todo-container">
            <div className="priority-container">
              <div className="toggle-grid">
                <button onClick={gridHandler}>
                  {toggleGrid ? verticalGrid : horizonGrid}
                </button>
              </div>
              <p>Priority</p>
              <p>High</p>
            </div>
            <div className="todos">
              {todo.map(todo => {
                const { id, name, completed } = todo
                return (
                  <List
                    key={id}
                    id={id}
                    name={name}
                    grid={toggleGrid}
                    completed={completed}
                    removeTodo={removeTodo}
                    handleCompleted={handleCompleted}
                  />
                )
              })}
            </div>
            <div className="low">
              <p>Low</p>
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
    grid-row-gap: ${props => (props.grid ? "0" : "1rem")};
    transition: all 1s ease;
  }
`

export default App
