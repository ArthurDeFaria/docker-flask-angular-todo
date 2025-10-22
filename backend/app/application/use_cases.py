from typing import List, Optional
import datetime
from app.domain.models import Task, Tag
from .repositories import AbstractTaskRepository, AbstractTagRepository

class TaskUseCases:
    def __init__(self, task_repository: AbstractTaskRepository, tag_repository: AbstractTagRepository):
        self.task_repository = task_repository
        self.tag_repository = tag_repository

    def create_task(self, title: str, description: Optional[str] = None, parent_id: Optional[int] = None) -> Task:
        task = Task(id=None, title=title, description=description, completed_at=None, parent_id=parent_id)
        return self.task_repository.add(task)

    def get_all_tasks(self) -> List[Task]:
        all_tasks = self.task_repository.get_all()
        task_map = {task.id: task for task in all_tasks}
        nested_tasks = []
        for task in all_tasks:
            if task.parent_id:
                parent = task_map.get(task.parent_id)
                if parent:
                    parent.children.append(task)
            else:
                nested_tasks.append(task)
        return nested_tasks
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        return self.task_repository.get_by_id(task_id)

    def update_task(self, task_id: int, title: Optional[str], description: Optional[str], is_done: Optional[bool], parent_id: Optional[int]) -> Optional[Task]:
        task = self.task_repository.get_by_id(task_id)
        if not task:
            return None
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if parent_id is not None:
            task.parent_id = parent_id
        if is_done is True and task.completed_at is None:
            task.completed_at = datetime.datetime.now(datetime.timezone.utc)
        elif is_done is False:
            task.completed_at = None
        return self.task_repository.update(task)

    def delete_task(self, task_id: int) -> bool:
        task = self.task_repository.get_by_id(task_id)
        if not task:
            return False
        self.task_repository.delete(task_id)
        return True
    
    def add_tag_to_task(self, task_id: int, tag_id: int) -> Optional[Task]:
        task = self.task_repository.get_by_id(task_id)
        tag = self.tag_repository.get_by_id(tag_id)
        if task and tag:
            # Evita adicionar tags duplicadas
            if tag not in task.tags:
                task.tags.append(tag)
                return self.task_repository.update(task)
        return None

class TagUseCases:
    def __init__(self, tag_repository: AbstractTagRepository):
        self.tag_repository = tag_repository

    def create_tag(self, name: str) -> Tag:
        # Verifica se a tag já existe
        existing_tag = self.tag_repository.get_by_name(name)
        if existing_tag:
            return existing_tag
        
        tag = Tag(id=None, name=name)
        return self.tag_repository.add(tag)

    def get_all_tags(self) -> List[Tag]:
        return self.tag_repository.get_all()