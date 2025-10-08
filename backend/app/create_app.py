# backend/app/create_app.py

import os
from flask import Flask
from dotenv import load_dotenv
from app.infrastructure.database.models import db
from app.infrastructure.web.routes import tasks_bp
from flask_cors import CORS

def create_app():
    load_dotenv()
    
    app = Flask(__name__)
    
    CORS(app)

    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL não foi definida no ambiente.")
    
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(tasks_bp)

    return app