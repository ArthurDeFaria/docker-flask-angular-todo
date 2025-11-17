import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() allTags: Tag[] = [];

  @Output() toggle = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() assignTag = new EventEmitter<{task: Task, event: Event}>();
  @Output() removeTag = new EventEmitter<{task: Task, tag: Tag}>();
  @Output() createSubtask = new EventEmitter<{parentId: number, title: string, description?: string}>();

  public isCreatingSubtask = false;
  public newSubtaskTitle = '';
  public newSubtaskDescription = '';

  public isChildrenVisible = false;

  constructor() {}

  toggleChildrenVisibility(): void {
    this.isChildrenVisible = !this.isChildrenVisible;
  }

  availableTagsForTask(task: Task): Tag[] {
    const taskTagIds = new Set(task.tags?.map(t => t.id));
    return this.allTags.filter(t => !taskTagIds.has(t.id));
  }

  onToggle(task: Task): void {
    this.toggle.emit(task);
  }

  onDelete(taskId: number): void {
    this.delete.emit(taskId);
  }

  onAssignTag(task: Task, event: Event): void {
    this.assignTag.emit({task, event});
    const selectElement = event.target as HTMLSelectElement;
    selectElement.value = '';
  }

  onRemoveTag(task: Task, tag: Tag): void {
    this.removeTag.emit({task, tag});
  }

  onShowSubtaskForm(): void {
    this.isCreatingSubtask = true;
  }

  onCancelSubtask(): void {
    this.isCreatingSubtask = false;
    this.newSubtaskTitle = '';
    this.newSubtaskDescription = '';
  }

  onSubmitSubtask(): void {
    if (!this.newSubtaskTitle.trim()) return;

    this.createSubtask.emit({
      parentId: this.task.id,
      title: this.newSubtaskTitle,
      description: this.newSubtaskDescription || undefined
    });
    
    this.onCancelSubtask();
  }
}