
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Enum
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import current_app
import jwt
    
from . import db

class User(UserMixin, db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(1000))
    age = db.Column(db.Integer, default=0)
    password = db.Column(db.String(128))
    api_key = db.Column(db.String(512))
    role = db.Column(Enum('user', 'admin', name='role_types'), default='user', nullable=False)
    money = db.Column(db.Integer, default=0)
    country = db.Column(db.String(128), default="")
    language = db.Column(db.String(128), default="en")
    
    # support_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'))
    # support = db.relationship('User', foreign_keys='User.support_id', lazy=True)

    # transactions_out = db.relationship('Transaction', backref='sender', foreign_keys='Transaction.sender_id', lazy=True)
    # transactions_in = db.relationship('Transaction', backref='recipient', foreign_keys='Transaction.recipient_id', lazy=True)

    # transactions = db.relationship('Transaction', backref='Transaction.sender_id',
    #                primaryjoin='or_(User.id==Transaction.sender_id, User.id==Transaction.recipient_id)', lazy=True)

    def set_password(self, password):
        self.password = password
        # generate_password_hash(password)

    def check_password(self, password):
        # return check_password_hash(self.password, password)
        return self.password == password
    
    def generate_api_key(self):
        payload = {
            "user_id": str(self.id)
        }
        key = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
        self.api_key = key
        return key
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            # "api_key": self.api_key,
            "money": self.money,
            "role": self.role
        }

class Transaction(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amount = db.Column(db.Integer, default=0)
    description = db.Column(db.String(512), default="")
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())

    sender_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'))
    recipient_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'))

    sender = db.relationship('User', foreign_keys='Transaction.sender_id', lazy=True)
    recipient = db.relationship('User', foreign_keys='Transaction.recipient_id', lazy=True)

    def to_dict(self):
        print("HELLO")
        result = {
            "id": self.id,
            "sender": self.sender.to_dict(),
            "recipient": self.recipient.to_dict(),
            "amount": self.amount,
            "description": self.description,
            "timestamp": self.timestamp
        }
        print(result)
        return result
    

# THIS PART IS FOR THE CHALLENGE
# ============================= 
class Job(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(128), default="")
    password = db.Column(db.String(128), default="")
    sender_id = db.Column(UUID(as_uuid=True), primary_key=True)
    done_at = db.Column(db.DateTime(timezone=True))
# =============================    