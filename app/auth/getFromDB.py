
from app import db, ma
from app.auth.models import User

def get_user_by_email(email):
    query = db.select(User).where(User.email == email)
    rows = db.session.execute(query).all()
    users = ''
    if len(rows) == 0:
        users = None
    else:
        users = rows[0][0]
    return users

def get_user_by_username(username):
    query = db.select(User).where(User.username == username)
    rows = db.session.execute(query).all()
    users = ''
    if len(rows) == 0:
        users = None
    else:
        users = rows[0][0]
    return users