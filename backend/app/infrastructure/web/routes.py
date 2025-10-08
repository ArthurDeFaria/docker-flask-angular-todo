from flask import Blueprint, request, jsonify
from app.application.use_cases import TaskUseCases
from app.infrastructure.database.repositories import SQLAlchemyTaskRepository

tasks_bp = Blueprint('tasks_bp', __name__)

# Aqui, estamos instanciando nossas classes. Em um projeto maior, usaríamos um container de injeção de dependência.
# Para este projeto, a instanciação manual é clara e suficiente.
task_repository = SQLAlchemyTaskRepository()
task_use_cases = TaskUseCases(task_repository)

# Endpoint para criar uma nova tarefa
@tasks_bp.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400
    
    try:
        new_task = task_use_cases.create_task(
            title=data['title'],
            description=data.get('description')
        )
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao criar a tarefa", "details": str(e)}), 500

# Endpoint para listar todas as tarefas
@tasks_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = task_use_cases.get_all_tasks()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao buscar as tarefas", "details": str(e)}), 500

# Endpoint para atualizar uma tarefa existente
@tasks_bp.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    
    updated_task = task_use_cases.update_task(
        task_id=task_id,
        title=data.get('title'),
        description=data.get('description'),
        is_done=data.get('done')
    )
    
    if updated_task:
        return jsonify(updated_task.to_dict())
    return jsonify({"error": "Tarefa não encontrada"}), 404

# Endpoint para deletar uma tarefa
@tasks_bp.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    success = task_use_cases.delete_task(task_id)
    if success:
        return '', 204 # Resposta de sucesso sem conteúdo
    return jsonify({"error": "Tarefa não encontrada"}), 404