from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from ariadne import ObjectType, make_executable_schema, graphql_sync, load_schema_from_path, snake_case_fallback_resolvers
import uuid
import jwt
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

    DB_USER = os.getenv('DB_USER')
    DB_PASS = os.getenv('DB_PASS')
    DB_NAME = os.getenv('DB_NAME')
    DB_HOST = os.getenv('DB_HOST')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
    app.config['SECRET_KEY'] = "SEdqwwdqdqwCRETA" # TODO str(uuid.uuid4())
    app.config['FLAG'] = "CTF{FLAG_FLAG_FLAG}"
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'main.hello'
    login_manager.init_app(app)

    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .models import User

    @login_manager.request_loader
    def load_user_from_request(request):
        # print(request.headers)
        api_key = request.headers.get('Authorization')
        if api_key:
            api_key = api_key.replace('Bearer ', '', 1)
            try:
                payload = jwt.decode(api_key, app.config['SECRET_KEY'], algorithms=["HS256"])
                user_id = payload.get("user_id")
                # print(user_id)
                user = User.query.filter_by(id=user_id).first()
                # print(user)
            except TypeError:
                pass
            if user:
                return user

        # finally, return None if both methods did not login the user
        return None
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    with app.app_context():
        db.create_all()
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
