import { Component, OnInit } from '@angular/core';
import { ApiService, CreateTaskPayload, UpdateTaskPayload } from '../../core/services/api.service';
import { Task } from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  public tasks: Task[] = [];
  public tags: Tag[] = [];

  public isLoadingTasks = true;
  public isLoadingTags = true;
  public errorMessage: string | null = null;

  public isModalOpen = false;
  public isTagModalOpen = false;

  // Form fields
  public newTaskTitle = '';
  public newTaskDescription = '';

  public newTagName = '';

  // Control editing mode
  public editingTask: Task | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  // =====================
  //  TASK MODAL CONTROL
  // =====================
  openCreateTaskModal(): void {
    this.isModalOpen = true;
    this.editingTask = null;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
  }

  openEditModal(task: Task): void {
    this.isModalOpen = true;
    this.editingTask = task;
    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description || '';

    task.showMenu = false; // Fecha menu após clicar
  }

  closeCreateTaskModal(): void {
    this.isModalOpen = false;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.editingTask = null;
  }

  // =====================
  //  TAG MODAL CONTROL
  // =====================
  openCreateTagModal(): void {
    this.isTagModalOpen = true;
  }

  closeCreateTagModal(): void {
    this.isTagModalOpen = false;
    this.newTagName = '';
  }

  // =====================
  //  LOAD API DATA
  // =====================
  loadAllData(): void {
    this.loadTasks();
    this.loadTags();
  }

  loadTasks(): void {
    this.isLoadingTasks = true;
    this.api.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoadingTasks = false;
      },
      error: () => {
        this.errorMessage = 'Falha ao carregar tarefas.';
        this.isLoadingTasks = false;
      }
    });
  }

  loadTags(): void {
    this.isLoadingTags = true;
    this.api.getTags().subscribe({
      next: (data) => {
        this.tags = data;
        this.isLoadingTags = false;
      },
      error: () => {
        this.errorMessage = 'Falha ao carregar tags.';
        this.isLoadingTags = false;
      }
    });
  }

  // =====================
  //  CREATE / UPDATE TASK
  // =====================
  saveTask(): void {
    if (!this.newTaskTitle.trim()) return;

    if (this.editingTask) {
      this.updateTask();
    } else {
      this.handleCreateTask();
    }
  }

  public handleCreateTask(): void {
    const payload: CreateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined
    };

    this.api.createTask(payload).subscribe(() => {
      this.loadTasks();
      this.closeCreateTaskModal();
    });
  }

  private updateTask(): void {
    if (!this.editingTask) return;

    const payload: UpdateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined
    };

    this.api.updateTask(this.editingTask.id, payload).subscribe(() => {
      this.loadTasks();
      this.closeCreateTaskModal();
    });
  }

  // =====================
  //  OTHER ACTIONS
  // =====================
  handleToggleComplete(task: Task): void {
    const payload: UpdateTaskPayload = {
      done: !task.completed_at
    };

    this.api.updateTask(task.id, payload).subscribe(() => {
      this.loadTasks();
    });
  }

  handleDeleteTask(taskId: number): void {
    this.api.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
  }

  handleCreateTag(): void {
    if (!this.newTagName.trim()) return;
    this.api.createTag(this.newTagName).subscribe(() => {
      this.loadTags();
      this.closeCreateTagModal();
    });
  }

  handleAssignTag(task: Task, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const tagId = selectElement.value;
    if (!tagId) return;

    this.api.addTagToTask(task.id, +tagId).subscribe(() => {
      this.loadTasks();
      selectElement.value = '';
    });
  }

  handleRemoveTag(task: Task, tag: Tag): void {
    this.api.removeTagFromTask(task.id, tag.id).subscribe(() => {
      this.loadTasks();
    });
  }

  // =====================
  //  GETTERS
  // =====================
  get pendingTasks(): Task[] {
    return this.tasks.filter(t => !t.completed_at);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(t => !!t.completed_at);
  }

  availableTagsForTask(task: Task): Tag[] {
    const taskTagIds = new Set(task.tags?.map(t => t.id));
    return this.tags.filter(t => !taskTagIds.has(t.id));
  }

  // =====================
  //  MENU TOGGLE
  // =====================
  toggleTaskMenu(task: Task) {
    task.showMenu = !task.showMenu;
    this.pendingTasks.forEach(t => {
      if (t !== task) t.showMenu = false;
    });
  }

  toggleCompletedMenu(task: Task) {
    task.showMenu = !task.showMenu;
    this.completedTasks.forEach(t => {
      if (t !== task) t.showMenu = false;
    });
  }
}
