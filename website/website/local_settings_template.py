# This is a copy of the local_settings.py file. This is used to store sensitive
# and machine specific information such as passwords and keys. Once the you have
# the values you'd like, rename (or duplicate) this file to "local_settings.py"
# and the "settings.py" file should import the relevant settings from this file.
# -------------------------------------------------------------------------------
# Local settings to use in settings.py file based on advice found at this
# website: https://aaronbloomfield.github.io/slp/docs/local-settings.html

database_engine = "django.db.backends.sqlite3"
database_name = 'db.sqlite3'

# Not used for sqlite3 databases
# database_user = "project"
# database_password = "abcdefg"
# database_host = "localhost"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/


debug = True
allowed_hosts = []

installed_apps = [
    'startpage.apps.StartpageConfig',
    'users.apps.UsersConfig',
    'crispy_forms',
]

static_url = '/static/'

crispy_template_pack = 'bootstrap4'

# default redirect url once user logs in
login_redirect_url = 'startpage-home'
login_url = 'login'

# how to send an email using python: https://www.interviewqs.com/blog/py_email
# note, this has nothing to do with django, just found it while searching for
# some answers to other questions
email_host_user = 'username@mailservice.com'  # replace with actual email
email_host_password = 'hunter2'  # heh
