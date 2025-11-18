from dataclasses import dataclass, asdict, field
from typing import Optional, List
import datetime

@dataclass
class Tag:
    id: Optional[int]
    name: str

    def to_dict(self):
        return asdict(self)

@dataclass
class Task:
    id: Optional[int]
    title: str
    description: Optional[str]
    completed_at: Optional[datetime.datetime]
    due_date: Optional[datetime.date] = None
    parent_id: Optional[int] = None
    order: int = 0
    children: List['Task'] = field(default_factory=list)
    tags: List[Tag] = field(default_factory=list)

    def to_dict(self):
        task_dict = asdict(self)
        task_dict['tags'] = [tag.to_dict() for tag in self.tags]
        return task_dict
