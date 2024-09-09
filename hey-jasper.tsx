import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, Circle, Plus, X, Tag } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Todo = {
  id: string
  text: string
  completed: boolean
  deadline: string
  label: string
}

export default function HeyJasper() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDeadline, setNewDeadline] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          deadline: newDeadline,
          label: newLabel,
        },
      ])
      setNewTodo('')
      setNewDeadline('')
      setNewLabel('')
      setIsAddingTask(false)
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedPercentage = (todos.filter(todo => todo.completed).length / todos.length) * 100 || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-blue-500 text-white">
          <h1 className="text-3xl font-bold text-center">Hey Jasper</h1>
        </div>
        <div className="p-6 space-y-6">
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105">
                <Plus className="w-6 h-6 mr-2" /> Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task" className="text-lg">Task</Label>
                  <Input
                    id="task"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter task name"
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-lg">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="text-lg py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-lg">Label</Label>
                  <Input
                    id="label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter label"
                    className="text-lg py-2"
                  />
                </div>
              </div>
              <Button onClick={addTodo} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105">
                Add Task
              </Button>
            </DialogContent>
          </Dialog>
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className="focus:outline-none"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {todo.label && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      <Tag className="w-4 h-4 inline mr-1" />
                      {todo.label}
                    </span>
                  )}
                  {todo.deadline && (
                    <span className="text-sm text-gray-500">
                      {format(parseISO(todo.deadline), 'MMM d')}
                    </span>
                  )}
                  <button 
                    onClick={() => removeTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{completedPercentage.toFixed(0)}%</div>
              <div className="text-gray-600 text-lg">Tasks Completed</div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${completedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}