from tortoise import fields
from tortoise.models import Model

class Auth(Model):
    id = fields.IntField(pk=True)
    user = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    role = fields.CharField(max_length=50)

    class Meta:
        table = "auth"

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

