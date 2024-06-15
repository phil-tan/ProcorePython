import sys
from flask import send_from_directory
import os
sys.dont_write_bytecode = True

from backend import create_app, db
from backend.models.user import User

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=3000)
