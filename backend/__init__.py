# init.py

from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from .controllers.oauth import login_required, refresh_app
from flask_cors import CORS
# from flask_wtf.csrf import CSRFProtect, generate_csrf
import os

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
    CORS(app)

    app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    # csrf = CSRFProtect(app)

    db.init_app(app)
    # app.app_context().push()
    # db.create_all()

    # @app.after_request
    # def add_csrf_header(response):
    #     response.headers["X-CSRF-Token"] = generate_csrf()
    #     return response

    # Serve the React pages route here
    
    @app.route('/app', defaults={'path': ''})
    @app.route('/app/<path:path>')
    @login_required
    def serve_react_app(path):
        print('serving react')
        refresh_app()
        print(path)
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:filename>')
    def serve_root_files(filename):
        # Serve other root files directly from the build directory
        return send_from_directory(app.static_folder, filename)

    # pages_controller
    from .controllers.pages import pages
    app.register_blueprint(pages)

    # auth controller
    from .controllers.oauth import oauth
    app.register_blueprint(oauth)

    from .controllers.cli import cli
    app.register_blueprint(cli)

    from .controllers.projects import projects
    app.register_blueprint(projects)

    from .controllers.issues import issues
    app.register_blueprint(issues)

    from .controllers.activities import activities
    app.register_blueprint(activities)

    return app