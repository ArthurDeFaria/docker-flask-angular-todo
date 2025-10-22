from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Tabela de associação para o relacionamento muitos-para-muitos
task_tags = db.Table('task_tags',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class TaskModel(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.Date, nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    children = db.relationship('TaskModel', backref=db.backref('parent', remote_side=[id]))
    
    # Relacionamento muitos-para-muitos com TagModel
    tags = db.relationship('TagModel', secondary=task_tags, lazy='subquery',
                           backref=db.backref('tasks', lazy=True))
    

class TagModel(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)