from tortoise import fields
from tortoise.models import Model

class Auth(Model):
    id = fields.IntField(pk=True)
    user = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    role = fields.CharField(max_length=50)

    class Meta:
        table = "auth"

class FileModel(Model):
    id = fields.IntField(pk=True)
    filename = fields.CharField(max_length=255)
    file_content = fields.BinaryField()
    description = fields.TextField(null=True)

    class Meta:
        table = "files"

class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, unique=True)

    class Meta:
        table = "categories"

class PostModel(Model):
    id = fields.IntField(pk=True)
    header = fields.CharField(max_length=255)
    body = fields.TextField()
    category = fields.ForeignKeyField('models.Category', related_name='texts')

    class Meta:
        table = "posts"

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")

