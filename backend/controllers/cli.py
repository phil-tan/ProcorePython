from flask import Blueprint, render_template
import click
from backend import db
from backend.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash


cli = Blueprint('cli', __name__)

@cli.cli.command('seed')
def seed():
    """Seed Database."""
    db.drop_all()
    db.create_all()

    # Add Users Seed
    user1 = User(email="user1@email.com", name="User1", password=generate_password_hash('password', method='sha256'))
    user2 = User(email="phil@email.com", name="Phil", password=generate_password_hash('password', method='sha256'))
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()
    print(User.query.all())