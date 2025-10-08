# backend/app/domain/models.py

from dataclasses import dataclass, asdict
from typing import Optional
import datetime

@dataclass
class Task:
    id: Optional[int]
    title: str
    description: Optional[str]
    completed_at: Optional[datetime.datetime]
    
    due_date: Optional[datetime.date] = None
    parent_id: Optional[int] = None

    def to_dict(self):
        return asdict(self)

# No futuro, devemos adicionar outras entidades aqui. Por exemplo:
# @dataclass
# class Tag:
#     id: Optional[int]
#     name: str
#     color: str