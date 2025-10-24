import { Component, OnInit } from '@angular/core';
import { ApiService, CreateTaskPayload, UpdateTaskPayload } from '../../core/services/api.service';
import { Task } from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  // --- Estado Principal ---
  public tasks: Task[] = [];
  public tags: Tag[] = [];

  // --- Estados de Carregamento e Erro ---
  public isLoadingTasks = true;
  public isLoadingTags = true;
  public errorMessage: string | null = null;

  // --- Formulário de Nova Tarefa ---
  public newTaskTitle = '';
  public newTaskDescription = '';

  // --- Formulário de Nova Tag ---
  public newTagName = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    // Carrega os dados iniciais quando o componente é iniciado
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadTasks();
    this.loadTags();
  }

  // --- Métodos de Carregamento de Dados ---

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

  // --- Métodos de Tarefas (Tasks) ---

  handleCreateTask(): void {
    if (!this.newTaskTitle.trim()) {
      alert('O título é obrigatório.'); // Em um app real, usar um modal/toast
      return;
    }

    const payload: CreateTaskPayload = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || undefined
    };

    this.api.createTask(payload).subscribe(
      () => {
        this.loadTasks(); // Recarrega a lista de tarefas
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      (error) => {
        console.error('Erro ao criar tarefa', error);
        this.errorMessage = 'Falha ao criar tarefa.';
      }
    );
  }

  handleToggleComplete(task: Task): void {
    // Se já tem data de conclusão, queremos reverter (is_done = false)
    // Se não tem, queremos completar (is_done = true)
    const payload: UpdateTaskPayload = {
      done: !task.completed_at
    };

    this.api.updateTask(task.id, payload).subscribe(
      () => {
        this.loadTasks(); // Recarrega a lista
      },
      (error) => {
        console.error('Erro ao atualizar tarefa', error);
        this.errorMessage = 'Falha ao atualizar tarefa.';
      }
    );
  }

  handleDeleteTask(taskId: number): void {
    // Em um app real, pedir confirmação
    // if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
    //   return;
    // }

    this.api.deleteTask(taskId).subscribe(
      () => {
        this.loadTasks(); // Recarrega a lista
      },
      (error) => {
        console.error('Erro ao excluir tarefa', error);
        this.errorMessage = 'Falha ao excluir tarefa.';
      }
    );
  }

  // --- Métodos de Tags ---

  handleCreateTag(): void {
    if (!this.newTagName.trim()) {
      alert('O nome da tag é obrigatório.');
      return;
    }

    this.api.createTag(this.newTagName).subscribe(
      () => {
        this.loadTags(); // Recarrega a lista de tags
        this.newTagName = '';
      },
      (error) => {
        console.error('Erro ao criar tag', error);
        // O backend pode retornar um erro se a tag for duplicada
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
        this.loadTasks(); // Recarrega as tarefas para mostrar a nova tag
        selectElement.value = ''; // Reseta o dropdown
      },
      (error) => {
        console.error('Erro ao adicionar tag', error);
        this.errorMessage = 'Falha ao adicionar tag à tarefa.';
        selectElement.value = '';
      }
    );
  }

  // --- Métodos Auxiliares (Helpers) ---

  // Filtra tarefas pendentes
  get pendingTasks(): Task[] {
    return this.tasks.filter(t => !t.completed_at);
  }

  // Filtra tarefas concluídas
  get completedTasks(): Task[] {
    return this.tasks.filter(t => !!t.completed_at);
  }

  // Filtra tags que ainda NÃO estão nesta tarefa específica
  availableTagsForTask(task: Task): Tag[] {
    const taskTagIds = new Set(task.tags?.map(t => t.id));
    return this.tags.filter(t => !taskTagIds.has(t.id));
  }
}
