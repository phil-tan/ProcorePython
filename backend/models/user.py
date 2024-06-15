from flask_login import UserMixin
from backend import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    
    def __repr__(self):
        return f'User("{self.name}")'

    def to_dict(self):
        self_dict = self.__dict__
        del self_dict['_sa_instance_state']
        return self_dict
