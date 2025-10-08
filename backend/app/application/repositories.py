from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.models import Task

class AbstractTaskRepository(ABC):

    @abstractmethod
    def add(self, task: Task) -> Task:
        """
        Adiciona uma nova tarefa à fonte de dados e retorna a tarefa com seu novo ID.
        """
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, task_id: int) -> Optional[Task]:
        """
        Busca uma tarefa pelo seu ID. Retorna a Tarefa ou None se não for encontrada.
        """
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[Task]:
        """
        Retorna uma lista de todas as tarefas.
        """
        raise NotImplementedError

    @abstractmethod
    def update(self, task: Task) -> Task:
        """
        Atualiza uma tarefa existente na fonte de dados.
        """
        raise NotImplementedError

    @abstractmethod
    def delete(self, task_id: int) -> None:
        """
        Deleta uma tarefa pelo seu ID. Não retorna nada em caso de sucesso.
        """
        raise NotImplementedError