from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=260)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="writer")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post {self.id} made by {self.user} on {self.date.strftime('%d %b %Y %H:%M:%S')}"
    
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_user")
    user_followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed_user")

    def __str__(self):
        return f"{self.user} is following {self.user_followed}"
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="like_user")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="like_post")

    def __str__(self):
        return f"{self.user} liked {self.post}"