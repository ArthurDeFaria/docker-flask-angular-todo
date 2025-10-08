# backend/app/application/use_cases.py

from typing import List, Optional
import datetime

from app.domain.models import Task
from .repositories import AbstractTaskRepository

class TaskUseCases:
    """
    Esta classe agrupa todos os casos de uso relacionados a tarefas.
    """
    def __init__(self, task_repository: AbstractTaskRepository):
        self.task_repository = task_repository

    def create_task(self, title: str, description: Optional[str] = None) -> Task:
        """
        Caso de uso para criar uma nova tarefa.
        """
        task = Task(id=None, title=title, description=description, completed_at=None)
        
        return self.task_repository.add(task)

    def get_all_tasks(self) -> List[Task]:
        """
        Caso de uso para buscar todas as tarefas.
        """
        return self.task_repository.get_all()
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Caso de uso para buscar uma tarefa específica pelo seu ID.
        """
        return self.task_repository.get_by_id(task_id)

    def update_task(self, task_id: int, title: Optional[str], description: Optional[str], is_done: Optional[bool]) -> Optional[Task]:
        """
        Caso de uso para atualizar uma tarefa.
        Contém a lógica de negócio para marcar uma tarefa como concluída.
        """
        task = self.task_repository.get_by_id(task_id)
        if not task:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        
        if is_done is True and task.completed_at is None:
            task.completed_at = datetime.datetime.now(datetime.timezone.utc)
        elif is_done is False:
            task.completed_at = None

        return self.task_repository.update(task)

    def delete_task(self, task_id: int) -> bool:
        """
        Caso de uso para deletar uma tarefa.
        """
        task = self.task_repository.get_by_id(task_id)
        if not task:
            return False
        
        self.task_repository.delete(task_id)
        return True