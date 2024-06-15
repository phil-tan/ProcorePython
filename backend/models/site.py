from backend import db


# class Site(db.Model):
# 	__tablename__ = 'sites'
# 	id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
# 	short_name = db.Column(db.String(100), unique=True)
# 	name = db.Column(db.String(100))
# 	image = db.Column(db.String(1000))
# 	max_date_range = db.Column(db.String(1000))
# 	access_list = db.Column(db.String(1000))

# 	def __repr__(self):
# 		return f'Site("{self.name}")'

# 	def to_dict(self):
# 		self_dict = self.__dict__
# 		if self_dict.get('_sa_instance_state'):
# 			del self_dict['_sa_instance_state']
# 		return self_dict
