from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models import Task, Tag

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
    
class AbstractTagRepository(ABC):
    @abstractmethod
    def add(self, tag: Tag) -> Tag:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, tag_id: int) -> Optional[Tag]:
        raise NotImplementedError
        
    @abstractmethod
    def get_by_name(self, tag_name: str) -> Optional[Tag]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[Tag]:
        raise NotImplementedError
    
    @abstractmethod
    def update(self, tag: Tag) -> Tag:
        raise NotImplementedError

    @abstractmethod
    def delete(self, tag_id: int) -> None:
        raise NotImplementedError