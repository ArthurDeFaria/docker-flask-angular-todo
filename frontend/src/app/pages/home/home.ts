import { Component, OnInit } from '@angular/core';
import { ApiService, CreateTaskPayload, UpdateTaskPayload } from '../../core/services/api.service';
import { Task } from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { TaskItemComponent } from '../../components/task-item/task-item.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [
    FormsModule,
    CommonModule,
    TaskItemComponent
  ],
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  public tasks: Task[] = [];
  public tags: Tag[] = [];

  public isLoadingTasks = true;
  public isLoadingTags = true;
  public errorMessage: string | null = null;

  public newTaskTitle = '';
  public newTaskDescription = '';

  public newTagName = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadTasks();
    this.loadTags();
  }

  loadTasks(): void {
    this.isLoadingTasks = true;
    this.errorMessage = null;
    this.api.getTasks().subscribe(
      (data) => {
        this.tasks = data;
        this.isLoadingTasks = false;
      },
      (error) => {
        console.error('Erro ao carregar tarefas', error);
        this.errorMessage = 'Falha ao carregar tarefas. Tente novamente mais tarde.';
        this.isLoadingTasks = false;
      }
    );
  }

  loadTags(): void {
    this.isLoadingTags = true;
    this.errorMessage = null;
    this.api.getTags().subscribe(
      (data) => {
        this.tags = data;
        this.isLoadingTags = false;
      },
      (error) => {
        console.error('Erro ao carregar tags', error);
        this.errorMessage = 'Falha ao carregar tags. Tente novamente mais tarde.';
        this.isLoadingTags = false;
      }
    );
  }

  handleCreateTask(): void {
    if (!this.newTaskTitle.trim()) {
      alert('O título é obrigatório.');
      return;
    }

    const payload: CreateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined
    };

    this.api.createTask(payload).subscribe(
      () => {
        this.loadTasks();
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      (error) => {
        console.error('Erro ao criar tarefa', error);
        this.errorMessage = 'Falha ao criar tarefa.';
      }
    );
  }

  handleCreateSubtask(event: {parentId: number, title: string, description?: string}): void {
    const payload: CreateTaskPayload = {
      title: event.title,
      description: event.description || undefined,
      parent_id: event.parentId
    };

    this.api.createTask(payload).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.error('Erro ao criar subtarefa', error);
        this.errorMessage = 'Falha ao criar subtarefa.';
      }
    );
  }

  handleToggleComplete(task: Task): void {
    const payload: UpdateTaskPayload = {
      done: !task.completed_at
    };

    this.api.updateTask(task.id, payload).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.error('Erro ao atualizar tarefa', error);
        this.errorMessage = 'Falha ao atualizar tarefa.';
      }
    );
  }

  handleDeleteTask(taskId: number): void {
    this.api.deleteTask(taskId).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.error('Erro ao excluir tarefa', error);
        this.errorMessage = 'Falha ao excluir tarefa.';
      }
    );
  }

  handleCreateTag(): void {
    if (!this.newTagName.trim()) {
      alert('O nome da tag é obrigatório.');
      return;
    }

    this.api.createTag(this.newTagName).subscribe(
      () => {
        this.loadTags();
        this.newTagName = '';
      },
      (error) => {
        console.error('Erro ao criar tag', error);
        this.errorMessage = 'Falha ao criar tag. (Talvez já exista?)';
      }
    );
  }

  handleAssignTag(task: Task, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const tagId = selectElement.value;

    if (!tagId) return;

    this.api.addTagToTask(task.id, +tagId).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.error('Erro ao adicionar tag', error);
        this.errorMessage = 'Falha ao adicionar tag à tarefa.';
      }
    );
  }

  handleRemoveTag(task: Task, tag: Tag): void {
    this.api.removeTagFromTask(task.id, tag.id).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.error('Erro ao remover tag', error);
        this.errorMessage = 'Falha ao remover tag da tarefa.';
      }
    );
  }

  get pendingTasks(): Task[] {
    return this.tasks.filter(t => !t.completed_at && !t.parent_id);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(t => !!t.completed_at && !t.parent_id);
  }
}