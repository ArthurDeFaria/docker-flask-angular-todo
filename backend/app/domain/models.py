from dataclasses import dataclass, asdict, field
from typing import Optional, List
import datetime

@dataclass
class Task:
    id: Optional[int]
    title: str
    description: Optional[str]
    completed_at: Optional[datetime.datetime]
    due_date: Optional[datetime.date] = None
    parent_id: Optional[int] = None
    children: List['Task'] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)

# No futuro, devemos adicionar outras entidades aqui. Por exemplo:
# @dataclass
# class Tag:
#     id: Optional[int]
#     name: str
#     color: str