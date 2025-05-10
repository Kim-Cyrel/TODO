import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { TodoService } from "../todo.service"
import type { Todo } from "../todo.model"

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = []
  newTodoTitle = ""
  completedCount = 0
  totalCount = 0
  editingTodoId: number | null = null
  editText = ""
  currentDate = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".")

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10)
      this.updateCounts()
    })
  }

  updateCounts(): void {
    this.totalCount = this.todos.length
    this.completedCount = this.todos.filter((todo) => todo.completed).length
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    }

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created)
      this.newTodoTitle = ""
      this.updateCounts()
    })
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe(() => {
      this.updateCounts()
    })
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.updateCounts()
    })
  }

  startEditing(todo: Todo) {
    this.editingTodoId = todo.id
    this.editText = todo.title
  }

  saveEdit(todo: Todo) {
    if (this.editText.trim()) {
      todo.title = this.editText.trim()
      this.updateTodo(todo)
    }
    this.cancelEdit()
  }

  cancelEdit() {
    this.editingTodoId = null
    this.editText = ""
  }

  getCheckboxColor(todo: Todo): string {
    if (!todo.completed) return ""

    // Assign a color based on the todo id to make it consistent
    const colors = ["#982db2", "#59b1a6", "#a83651", "#525998", "#b1bf5d"]
    return colors[todo.id % colors.length]
  }
}
