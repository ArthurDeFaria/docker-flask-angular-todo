from typing import List, Optional
from app.application.repositories import AbstractTaskRepository
from app.domain.models import Task
from .models import db, TaskModel

class SQLAlchemyTaskRepository(AbstractTaskRepository):
    
    def _to_domain(self, task_model: TaskModel) -> Task:
        return Task(
            id=task_model.id,
            title=task_model.title,
            description=task_model.description,
            completed_at=task_model.completed_at,
            due_date=task_model.due_date,
            parent_id=task_model.parent_id
        )

    def add(self, task: Task) -> Task:
        new_task_model = TaskModel(
            title=task.title, 
            description=task.description,
            completed_at=task.completed_at,
            due_date=task.due_date,
            parent_id=task.parent_id
        )
        db.session.add(new_task_model)
        db.session.commit()
        return self._to_domain(new_task_model)

    def get_by_id(self, task_id: int) -> Optional[Task]:
        task_model = TaskModel.query.get(task_id)
        if task_model:
            return self._to_domain(task_model)
        return None

    def get_all(self) -> List[Task]:
        all_task_models = TaskModel.query.all()
        return [self._to_domain(tm) for tm in all_task_models]

    def update(self, task: Task) -> Task:
        task_model = TaskModel.query.get(task.id)
        if task_model:
            task_model.title = task.title
            task_model.description = task.description
            task_model.completed_at = task.completed_at
            task_model.due_date = task.due_date
            task_model.parent_id = task.parent_id
            db.session.commit()
            return self._to_domain(task_model)
        return None

    def delete(self, task_id: int) -> None:
        task_model = TaskModel.query.get(task_id)
        if task_model:
            db.session.delete(task_model)
            db.session.commit()