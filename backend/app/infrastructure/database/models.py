from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class TaskModel(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    due_date = db.Column(db.Date, nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

# No futuro, o modelo da Tag viria aqui também.
# class TagModel(db.Model):
#     ...