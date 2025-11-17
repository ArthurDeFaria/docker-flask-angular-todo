// TaskModel - models.py
import { Tag } from './tag.model';

export interface Task {
  showMenu: boolean;
  id: number;
  title: string;
  description: string | null; // Pode ser string ou nulo
  completed_at: string | null; // O Python envia datas como strings
  due_date: string | null;
  parent_id: number | null;
  children?: Task[]; // Lista opcional de subtarefas
  tags?: Tag[];     // Lista opcional de tags
}
