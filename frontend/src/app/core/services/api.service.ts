import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Tag } from '../models/tag.model';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  done?: boolean;
  parent_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // --- Métodos de Tasks ---

  // GET /api/tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  // POST /api/tasks
  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload);
  }

  // PUT /api/tasks/<task_id>
  updateTask(taskId: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, payload);
  }

  // DELETE /api/tasks/<task_id>
  deleteTask(taskId: number): Observable<void> { // Retorna 204 (void)
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  // --- Métodos de Tags ---

  // GET /api/tags
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }

  // POST /api/tags
  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, { name: name });
  }

  // POST /api/tasks/<task_id>/tags
  addTagToTask(taskId: number, tagId: number): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks/${taskId}/tags`, { tag_id: tagId });
  }

  // PUT /api/tags/<tag_id>
  updateTag(tagId: number, name: string): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/${tagId}`, { name: name });
  }

  // DELETE /api/tags/<tag_id>
  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}`);
  }
}
