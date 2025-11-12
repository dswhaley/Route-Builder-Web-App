from flask_wtf import FlaskForm
from wtforms import EmailField, PasswordField, SubmitField, StringField, DateField
from wtforms.validators import InputRequired, Email, Length, DataRequired

MIN_PASSWORD_LENGTH: int = 8

class LoginForm(FlaskForm):
    email: EmailField = EmailField('Email',
        validators=[InputRequired(), Email()])
    password: PasswordField = PasswordField('Password',
        validators=[InputRequired(), Length(min=MIN_PASSWORD_LENGTH)])
    submit: SubmitField = SubmitField("Login")

class SignUpForm(FlaskForm):
    username: StringField = StringField(
        'Username', 
        validators=[
            InputRequired(message="Please enter a username."),
            Length(min=3, max=20, message="Username must be between 3 and 20 characters.")
        ]
    )
    dob: DateField = DateField(
        'Date of Birth',
        format='%Y-%m-%d',
        validators=[InputRequired(message="Please enter your date of birth.")]
    )
    email: EmailField = EmailField('Email',
        validators=[InputRequired(), Email()])
    
    password: PasswordField = PasswordField('Password',
        validators=[InputRequired(), Length(min=MIN_PASSWORD_LENGTH)])
    
    confirm_password: PasswordField = PasswordField('Password',
        validators=[InputRequired(), Length(min=MIN_PASSWORD_LENGTH)])
