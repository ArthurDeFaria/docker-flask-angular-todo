import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService, CreateTaskPayload, UpdateTaskPayload } from '../../core/services/api.service';
import { Task } from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [FormsModule, CommonModule],
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

  // Modal control
  public isEditing = false; // true = editing task / false = creating task
  public isSubtask = false; // true = creating subtask
  public parentTask: Task | null = null;

  // Form fields
  public newTaskTitle = '';
  public newTaskDescription = '';

  public newTagName = '';
  public taskToDelete: Task | null = null;

  public editingTask: Task | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadTasks();
    this.loadTags();
  }

  loadTasks(): void {
    this.isLoadingTasks = true;

    this.api.getTasks().subscribe({
      next: (data) => {
        // ensure children array exists for each task
        this.tasks = (data || []).map((t: any) => ({
          ...t,
          children: t.children || [],
          tags: t.tags || [],
          showMenu: false
        }));
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
        this.tags = data || [];
        this.isLoadingTags = false;
      },
      error: () => {
        this.errorMessage = 'Falha ao carregar tags.';
        this.isLoadingTags = false;
      }
    });
  }

  /* -------------------- MODAL DE TASK -------------------- */

  // chamado pelo botão "+ Criar Nova Tarefa" (p/ task raiz) ou pelo menu de task (p/ subtask)
  openCreateTaskModal(parentTask?: Task): void {
    this.isModalOpen = true;
    this.isEditing = false;

    this.isSubtask = !!parentTask;
    this.parentTask = parentTask || null;

    this.newTaskTitle = '';
    this.newTaskDescription = '';
  }

  openEditModal(task: Task): void {
    this.isModalOpen = true;
    this.isEditing = true;
    this.editingTask = task;
    this.isSubtask = !!task.parent_id;

    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description || '';

    task.showMenu = false;
  }

  closeCreateTaskModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.isSubtask = false;
    this.parentTask = null;
    this.editingTask = null;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
  }

  // HTML's form uses (ngSubmit)="handleCreateTask()" — expõe método público
  public handleCreateTask(): void {
    this.saveTask();
  }

  /* -------------------- SALVAR TASK / SUBTASK -------------------- */

  saveTask(): void {
    if (!this.newTaskTitle.trim()) return;

    if (this.isEditing && this.editingTask) {
      this.updateTask();
    } else {
      this.createTaskOrSubtask();
    }
  }

  createTaskOrSubtask(): void {
    const payload: CreateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined,
      parent_id: this.parentTask ? this.parentTask.id : undefined
    };

    this.api.createTask(payload).subscribe({
      next: () => {
        this.loadTasks();
        this.closeCreateTaskModal();
      },
      error: (err) => {
        console.error('Erro ao criar tarefa/subtarefa', err);
        this.errorMessage = 'Falha ao criar tarefa.';
      }
    });
  }

  updateTask(): void {
    if (!this.editingTask) return;

    const payload: UpdateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined
    };

    this.api.updateTask(this.editingTask.id, payload).subscribe({
      next: () => {
        this.loadTasks();
        this.closeCreateTaskModal();
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa', err);
        this.errorMessage = 'Falha ao atualizar tarefa.';
      }
    });
  }

  /* ---------------- SUBTASK PROGRESSION ---------------- */

  areAllSubtasksCompleted(task: Task): boolean {
    return !task.children || task.children.length === 0 || task.children.every(st => !!st.completed_at);
  }

  handleToggleComplete(task: Task): void {
    const isCompleting = !task.completed_at;

    // Se for concluir uma Task → só pode se todas subtasks concluídas
    if (isCompleting && !this.areAllSubtasksCompleted(task)) {
      alert('Você só pode concluir essa tarefa quando TODAS as subtarefas forem concluídas.');
      return;
    }

    const payload: UpdateTaskPayload = {
      done: isCompleting
    };

    this.api.updateTask(task.id, payload).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        console.error('Erro ao alternar conclusão', err);
        this.errorMessage = 'Falha ao atualizar tarefa.';
      }
    });
  }

  /* -------------------- DELETE -------------------- */

  openDeleteConfirm(task: Task) {
    this.taskToDelete = task;
    task.showMenu = false;
  }

  confirmDeleteTask() {
    if (!this.taskToDelete) return;

    this.api.deleteTask(this.taskToDelete.id).subscribe({
      next: () => {
        this.loadTasks();
        this.taskToDelete = null;
      },
      error: (err) => {
        console.error('Erro ao excluir', err);
        this.errorMessage = 'Falha ao excluir tarefa.';
      }
    });
  }

  cancelDeleteTask() {
    this.taskToDelete = null;
  }

  /* -------------------- TAGS -------------------- */

  openCreateTagModal(): void {
    this.isTagModalOpen = true;
  }

  closeCreateTagModal(): void {
    this.isTagModalOpen = false;
    this.newTagName = '';
  }

  handleCreateTag(): void {
    if (!this.newTagName.trim()) return;
    this.api.createTag(this.newTagName).subscribe({
      next: () => {
        this.loadTags();
        this.closeCreateTagModal();
      },
      error: (err) => {
        console.error('Erro ao criar tag', err);
        this.errorMessage = 'Falha ao criar tag.';
      }
    });
  }

  handleAssignTag(task: Task, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const tagId = selectElement.value;
    if (!tagId) return;

    this.api.addTagToTask(task.id, +tagId).subscribe({
      next: () => {
        this.loadTasks();
        selectElement.value = '';
      },
      error: (err) => {
        console.error('Erro ao adicionar tag', err);
        this.errorMessage = 'Falha ao adicionar tag à tarefa.';
        selectElement.value = '';
      }
    });
  }

  handleRemoveTag(task: Task, tag: Tag): void {
    this.api.removeTagFromTask(task.id, tag.id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        console.error('Erro ao remover tag', err);
        this.errorMessage = 'Falha ao remover tag.';
      }
    });
  }

  /* -------------------- GETTERS -------------------- */

  get pendingTasks(): Task[] {
    // apenas tasks raiz que não estão concluídas
    return this.tasks.filter(t => !t.completed_at && !t.parent_id);
  }

  get completedTasks(): Task[] {
    // apenas tasks raiz concluídas
    return this.tasks.filter(t => !!t.completed_at && !t.parent_id);
  }

  availableTagsForTask(task: Task): Tag[] {
    const taskTagIds = new Set(task.tags?.map(t => t.id));
    return this.tags.filter(t => !taskTagIds.has(t.id));
  }

  /* -------------------- MENUS -------------------- */

  toggleTaskMenu(task: Task) {
    this.closeAllTaskMenus();
    task.showMenu = !task.showMenu;
  }

  toggleCompletedMenu(task: Task) {
    this.closeAllTaskMenus();
    task.showMenu = !task.showMenu;
  }

  closeAllTaskMenus() {
    this.tasks.forEach(t => (t as any).showMenu = false);
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.task-menu-wrapper')) {
      this.closeAllTaskMenus();
    }
  }

}
