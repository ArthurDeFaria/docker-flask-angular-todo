from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models import Task

class AbstractTaskRepository(ABC):

    @abstractmethod
    def add(self, task: Task) -> Task:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, task_id: int) -> Optional[Task]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[Task]:
        raise NotImplementedError

    @abstractmethod
    def update(self, task: Task) -> Task:
        raise NotImplementedError

    @abstractmethod
    def delete(self, task_id: int) -> None:
        raise NotImplementedError