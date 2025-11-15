from enum import Enum

from flask_wtf import FlaskForm
from wtforms import Form, Field, ValidationError, StringField, DateTimeLocalField, SelectField, SubmitField, IntegerField, FloatField
from wtforms.validators import InputRequired, Length, NumberRange, Optional
from datetime import datetime
from app.core.models import Type


################################################################################
# Custom Form Validators
################################################################################

# custom validator to check if the hidden field is a number in a reasonable range
class StringIntegerRange():
    def __init__(self, min:int|None=None, max:int|None=None) -> None:
        self.min = min
        self.max = max
    def __call__(self, form: Form, field: Field) -> None:
        # get the value out of the field as a string if it is present
        value: str|None = None if field.data is None else str(field.data)
        # if the value is not present this is an error
        if value is None:
            raise ValidationError("This field is required")
        # if the value is not an integer, this is an error
        try:
            num: int = int(value)
        except ValueError:
            raise ValidationError("Must be an integer")
        # if there is a lower bound and this number is less than it . . .
        if self.min is not None and num < self.min:
            raise ValidationError(f"Must be at least {self.min}")
        # if there is an upper bound and this number is greater than it . . .
        if self.max is not None and num > self.max:
            raise ValidationError(f"Must be less than {self.max}")

# custom validator to ensure the value selected is valid for the chosen enum
class CheckEnum():
    def __init__(self, e: type[Enum]) -> None:
        self.enum = e
    def __call__(self, form: Form, field: Field) -> None:
        if not hasattr(self.enum, field.data):
            names: list[str] = [member.name for member in self.enum]
            raise ValidationError(f"Must be one of ({'|'.join(names)})")

################################################################################
# Forms
################################################################################

class ActivityForm(FlaskForm):
    title: StringField = StringField(
        'Activity Title',
        validators=[
            InputRequired(message="Please enter a title for the activity."),
            Length(min=1, max=100, message="Title must be between 1 and 100 characters.")
        ]
    )
    type: SelectField = SelectField(
        'Activity Type',
        choices=[(t.name, t.value) for t in Type],
        validators=[InputRequired(message="Please select an activity type.")]
    )
    start_time: DateTimeLocalField = DateTimeLocalField(
        'Start Time',
        format='%Y-%m-%dT%H:%M',  
        validators=[InputRequired(message="Please provide a start time.")],
        default=datetime.now()  # type: ignore[arg-type]
    )
    duration_minutes: IntegerField = IntegerField(
        'Duration (minutes)',
        validators=[
            InputRequired(message="Please enter the duration in minutes."),
            NumberRange(min=1, max = 1440, message="Duration must be between 1 and 1440 minutes")
        ]
    )
    route: SelectField = SelectField(
        'Route (optional)',
        choices=[],
        validators=[Optional()]
    )
    distance: FloatField = FloatField(
        'Distance (miles)',
        validators=[
            Optional(),
            NumberRange(min=0.1, message="Distance must be positive.")
        ]
    )

    submit = SubmitField("Create Activity")