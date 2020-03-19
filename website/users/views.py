from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm


def register(request):
    # If [if] a form is submitted by a user, i.e. a POST request is received, we take
    # in the request, validate it and save it. Otherwise [else], if the form is
    # requested, then we send back a blank form
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            # saves the user
            form.save()
            # valid form data will be in the dictionary called 'form.cleaned_data'
            # username = form.cleaned_data.get('username')
            # show flash message to show that we've received the data
            messages.success(
                request, f'Your account has been created! You are now able to log in.')
            # then redirect the user to the home page
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})


@login_required
def profile(request):
    if request.method == 'POST':
        # what to do with the post request we get (i.e. the filled form data from
        # the user when they update the photo/username/password)
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(
            request.POST, request.FILES, instance=request.user.profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(
                request, f'Your account has been updated!')
            # then redirect the user to their profile page note: this
            # redirection prevents POST GET REDIRECT PATTERN. if we reload our
            # browser after or hit back button, it asks us if we're sure we want
            # to resubmit the form. This is the broswer warning us that we're
            # about to generate a POST request. Redirection causes the browser
            # to send a GET request preventing that message.
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.profile)

    context = {
        'u_form': u_form,
        'p_form': p_form
    }
    return render(request, 'users/profile.html', context)
