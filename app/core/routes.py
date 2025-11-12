from typing import Sequence, Tuple
from sqlalchemy import Row, Select
from flask import  render_template, redirect, url_for, current_app
from flask_login import login_required, current_user

from app import db
from app.core import bp
from app.core.forms import ActivityForm
from app.auth.models import User
from app.core.models import Activity

@bp.get("/")
def index():
    form = ActivityForm
    return render_template("activity.html", form = form)

# @bp.get('/')
# @login_required
# def index():
#     return redirect(url_for('core.get_accounts'))

# @bp.get('/accounts/')
# @login_required
# def get_accounts():
#     accounts: list[Account] = get_all_accounts()
#     return render_template('index.html', accounts=accounts)

# # TODO: define routes for listing Banks and Customers
# @bp.get('/banks/')
# @login_required
# def get_banks():
#     query: Select[Tuple[Account]] = db.select(Bank)
#     rows = db.session.execute(query).all()
#     banks = [row[0] for row in rows]

#     return render_template('banks.html', banks=banks)

# @bp.get('/customers/')
# @login_required
# def get_customers():
#     query: Select[Tuple[Account]] = db.select(Customer)
#     rows = db.session.execute(query).all()
#     customers = [row[0] for row in rows]

#     return render_template('customers.html', customers=customers)



# def get_all_accounts() -> list[Account]:
#     query: Select[Tuple[Account]] = db.select(Account)
#     rows:  Sequence[Row[Tuple[Account]]] = db.session.execute(query).all()
#     accounts: list[Account] = [row[0] for row in rows]
#     return accounts
