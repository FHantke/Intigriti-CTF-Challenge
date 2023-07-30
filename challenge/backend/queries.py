from .models import User, Transaction, Job
from . import db
from flask_login import current_user
from flask import current_app
import random
import string
import uuid

def auth_check(func):
    def wrapper(*args, **kwargs):
        if current_user.is_authenticated:
            return func(*args, **kwargs)
        else:
            msg = "Not authenticated"
            return { "success": False, "errors": [msg] }
    return wrapper

@auth_check
def resolve_users(obj, info):
    try:
        users = [user.to_dict() for user in User.query.all()]
        payload = {
            "success": True,
            "users": users
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

def return_user(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()
        payload = {
            "success": True,
            "user": user
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

@auth_check
def resolve_user(obj, info, user_id):
    return return_user(user_id)

@auth_check
def resolve_me(obj, info):
    return return_user(current_user.id)

def resolve_create_user(obj, info, name, password):
    try:        
        user = User.query.filter_by(name=name).first()
        if user:
            return {
                "success": False,
                "errors": ["User already exists..."]
            }
        
        user = User(name=name)
        db.session.add(user)
        user.set_password(password)
        db.session.commit()
        api_key = user.generate_api_key()
        db.session.commit()

        # THIS PART IS FOR THE CHALLENGE
        # =============================        
        user_support = User(name=f"{name}_personal_support", money=random.randint(12000, 60000), role="admin")
        db.session.add(user_support)
        user_support.set_password("".join([random.choice(string.ascii_letters) for _ in range(16)]))
        db.session.commit()
        user_support.generate_api_key()
        db.session.commit()

        description = f"""
            Welcome to BugBank. I am your personal support concat. As soon as we build our chat function, you can send me messages.
            Until then, please do not send any transactions! It gives me a notification and I need to check them... Cheers {user_support.name}
        """
        transaction = Transaction(sender_id=user_support.id, recipient_id=user.id, amount=0, description=description)
        db.session.add(transaction)
        db.session.commit()
        # =============================

        payload = {
            "success": True,
            "apikey": api_key
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }

    return payload

def resolve_login_user(obj, info, name, password):
    try:        
        user = User.query.filter_by(name=name).first()
        if not user:
            return {
                "success": False,
                "errors": ["User does not exist..."]
            }
        
        if user.check_password(password):
            print("API API API KEY")
            print(user.api_key)
            return {
                "success": True,
                "apikey": user.api_key
            }
        else:
            return {
                "success": False,
                "errors": ["Password not correct"]
            }
        
    except Exception as error:  # date format errors
        return {
            "success": False,
            "errors": [str(error)]
        }

@auth_check
def resolve_transactions(obj, info):
    try:
        user_id = current_user.id
        transactions_all = Transaction.query.filter((Transaction.recipient_id==user_id) | (Transaction.sender_id == user_id)).all()
        transactions = [transaction.to_dict() for transaction in transactions_all]
        payload = {
            "success": True,
            "transactions": transactions
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)],
        }
    
    print(payload)
    return payload

@auth_check
def resolve_create_transaction(obj, info, recipientId, amount, description):
    print(current_user.to_dict())
    if current_user.money < amount:
        return {
            "success": False,
            "errors": ["Not enough money"]
        }
    
    try:
        uuid.UUID(recipientId)
    except:
        return {
            "success": False,
            "errors": ["Wrong recipientId"]
        }
    
    recipient = User.query.filter_by(id=recipientId).first()
    if not recipient:
        return {
            "success": False,
            "errors": ["No user with this recipientId found"]
        }
    
    # THIS PART IS FOR THE CHALLENGE
    # =============================    
    if recipient.role == "admin":
        job = Job(username=recipient.name, password=recipient.password, sender_id=current_user.id)
        db.session.add(job)
        db.session.commit()
    # =============================    
    
    current_user.money -= amount
    recipient.money += amount
    transaction = Transaction(sender_id=current_user.id, recipient_id=recipientId, amount=amount, description=description)
    db.session.add(transaction)
    db.session.commit()

    return {
            "success": True,
            "transaction": transaction
        }

@auth_check
def resolve_upgrade(obj, info):
    if current_user.money < 10000:
        return {
            "success": False,
            "errors": ["Not enough money"]
        }
    
    current_user.money -= 10000
    db.session.commit()

    return {
            "success": True,
            "flag": current_app.config['FLAG']
        }

@auth_check
def resolve_user_update(obj, info, userId=None, name=None, input=None):
    # Update user name, lng
    try:
          
        # Check if user name exists
        if "name" in input:
            user = User.query.filter(User.id != userId).filter_by(name=input.get(name)).first()
            if user:
                return {
                    "success": False,
                    "errors": ["User already exists..."]
                }
        
        user = User.query.filter((User.id==userId) | (User.name==name)).first()

        print(f"USER with {userId} and {name}")
        print(user)
        print(input.get("age", user.age))

        user.name = input.get("name", user.name)
        user.age = input.get("age", user.age)
        user.language = input.get("language", user.language)
        user.country = input.get("country", user.country)
        db.session.commit()

        payload = {
            "success": True,
            "user": user
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload