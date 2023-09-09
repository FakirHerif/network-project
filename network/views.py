from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User, Post, Follow, Like

import json
from django.http import JsonResponse


def index(request):
    allPosts = Post.objects.all().order_by("id").reverse()
    # add Pagination
    paginator = Paginator(allPosts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    likes = Like.objects.all()

    whoYouLiked = []
    try:
        for like in likes:
            if like.user.id == request.user.id:
                whoYouLiked.append(like.post.id)
    except:
        whoYouLiked =[]
    

    return render(request, "network/index.html", {
        "allPosts": allPosts,
        "page_obj": page_obj,
        "whoYouLiked": whoYouLiked
    })


def like_remove(request, post_id):
    post = Post.objects.get(pk=post_id)
    user = User.objects.get(pk=request.user.id)
    like = Like.objects.filter(user=user, post=post)
    like.delete()
    return JsonResponse({"message": "UNLIKED!"})

def like_add(request, post_id):
    post = Post.objects.get(pk=post_id)
    user = User.objects.get(pk=request.user.id)
    likeNew = Like(user=user, post=post)
    likeNew.save()
    return JsonResponse({"message": "LIKED!"})


def edit(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        post_edit = Post.objects.get(pk=post_id)
        post_edit.content = data["content"]
        post_edit.save()
        return JsonResponse({"message": "SAVE OK!", "data": data["content"] })


def addPost(request):
    if request.method == "POST":
        content = request.POST['content']
        user = User.objects.get(pk=request.user.id)
        post = Post(content=content, user=user)
        post.save()
        return HttpResponseRedirect(reverse(index))
    
def delete_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        if post.user == request.user:
            post.delete()
            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponse("You are not authorized to delete this post.")
    except Post.DoesNotExist:
            return HttpResponse("Post not found.")


def profile(request, user_id):
    user = User.objects.get(pk=user_id)
    allPosts = Post.objects.filter(user=user).order_by("id").reverse()
    paginator = Paginator(allPosts, 2)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    following = Follow.objects.filter(user=user)
    followers = Follow.objects.filter(user_followed=user)
    try:
        checkFollow = followers.filter(user=User.objects.get(pk=request.user.id))
        if len(checkFollow) !=0:
            isFollowing = True
        else:
            isFollowing = False
    except:
        isFollowing = False
    return render(request, "network/profile.html", {
        "allPosts": allPosts,
        "page_obj": page_obj,
        "username": user.username,
        "following": following,
        "followers": followers,
        "isFollowing": isFollowing,
        "userExist": user
    })

def following(request):
    userCurrent = User.objects.get(pk=request.user.id)
    followPpl = Follow.objects.filter(user=userCurrent)
    postAll = Post.objects.all().order_by('id').reverse()
    postsFollowing = []

    for post in postAll:
        for person in followPpl:
            if person.user_followed == post.user:
                postsFollowing.append(post)

    paginator = Paginator(postsFollowing, 2)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/following.html", {
        "page_obj": page_obj
    })                

def follow(request):
    userfollow = request.POST['userfollow']
    userCurrent = User.objects.get(pk=request.user.id)
    followUserData = User.objects.get(username=userfollow)
    flw = Follow(user=userCurrent, user_followed=followUserData)
    flw.save()
    user_id = followUserData.id
    return HttpResponseRedirect(reverse(profile, kwargs={'user_id': user_id}))

def unfollow(request):
    userfollow = request.POST['userfollow']
    userCurrent = User.objects.get(pk=request.user.id)
    followUserData = User.objects.get(username=userfollow)
    flw = Follow.objects.get(user=userCurrent, user_followed=followUserData)
    flw.delete()
    user_id = followUserData.id
    return HttpResponseRedirect(reverse(profile, kwargs={'user_id': user_id}))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
