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

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  createTask(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload);
  }

  updateTask(taskId: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, payload);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }

  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, { name: name });
  }

  addTagToTask(taskId: number, tagId: number): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks/${taskId}/tags`, { tag_id: tagId });
  }

  removeTagFromTask(taskId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}/tags/${tagId}`);
  }

  updateTag(tagId: number, name: string): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/${tagId}`, { name: name });
  }

  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}`);
  }
}