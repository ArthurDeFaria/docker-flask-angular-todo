from flask import Blueprint, request, jsonify
from app.application.use_cases import TaskUseCases, TagUseCases
from app.infrastructure.database.repositories import SQLAlchemyTaskRepository, SQLAlchemyTagRepository

tasks_bp = Blueprint('tasks_bp', __name__)

# Repository
task_repository = SQLAlchemyTaskRepository()
tag_repository = SQLAlchemyTagRepository()

# UseCases
task_use_cases = TaskUseCases(task_repository, tag_repository)
tag_use_cases = TagUseCases(tag_repository)



@tasks_bp.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400
    try:
        new_task = task_use_cases.create_task(
            title=data['title'],
            description=data.get('description'),
            parent_id=data.get('parent_id') # Passando o parent_id
        )
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao criar a tarefa", "details": str(e)}), 500

@tasks_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = task_use_cases.get_all_tasks()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao buscar as tarefas", "details": str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    updated_task = task_use_cases.update_task(
        task_id=task_id,
        title=data.get('title'),
        description=data.get('description'),
        is_done=data.get('done'),
        parent_id=data.get('parent_id')
    )
    if updated_task:
        return jsonify(updated_task.to_dict())
    return jsonify({"error": "Tarefa não encontrada"}), 404

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    success = task_use_cases.delete_task(task_id)
    if success:
        return '', 204
    return jsonify({"error": "Tarefa não encontrada"}), 404

@tasks_bp.route('/api/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({"error": "O campo 'name' é obrigatório"}), 400
    try:
        new_tag = tag_use_cases.create_tag(name=data['name'])
        return jsonify(new_tag.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao criar a tag", "details": str(e)}), 500

@tasks_bp.route('/api/tags', methods=['GET'])
def get_tags():
    try:
        tags = tag_use_cases.get_all_tags()
        return jsonify([tag.to_dict() for tag in tags])
    except Exception as e:
        return jsonify({"error": "Ocorreu um erro ao buscar as tags", "details": str(e)}), 500

@tasks_bp.route('/api/tasks/<int:task_id>/tags', methods=['POST'])
def add_tag_to_task(task_id):
    data = request.get_json()
    tag_id = data.get('tag_id')
    if not tag_id:
        return jsonify({"error": "O campo 'tag_id' é obrigatório"}), 400

    updated_task = task_use_cases.add_tag_to_task(task_id, tag_id)
    if updated_task:
        return jsonify(updated_task.to_dict())
    return jsonify({"error": "Tarefa ou Tag não encontrada"}), 404