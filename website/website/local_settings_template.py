# This is a copy of the local_settings.py file. This is used to store sensitive
# and machine specific information such as passwords and keys. Once the you have
# the values you'd like, rename (or duplicate) this file to "local_settings.py"
# and the "settings.py" file should import the relevant settings from this file.
# -------------------------------------------------------------------------------
# Local settings to use in settings.py file based on advice found at this
# website: https://aaronbloomfield.github.io/slp/docs/local-settings.html

database_engine = "django.db.backends.postgresql_psycopg2"
database_name = 'autometa'
database_user = 'autometa'
database_password = 'haveibeenpwned?'
database_host = '127.0.0.1'
database_port = 5432

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

debug = True
allowed_hosts = []

installed_apps = [
    'startpage.apps.StartpageConfig',
    'users.apps.UsersConfig',
    'crispy_forms',
    'django_tables2',
]

static_url = '/static/'

crispy_template_pack = 'bootstrap4'

# default redirect url once user logs in
login_redirect_url = 'startpage-home'
login_url = 'login'

# how to send an email using python: https://www.interviewqs.com/blog/py_email
# note, this has nothing to do with django, just found it while searching for
# some answers to other questions
email_host = 'smtp.mailservice.com'
email_port = 587  # smtp typically uses this port
email_use_TLS = True
email_host_user = 'username@mailservice.com'  # replace with actual email
email_host_password = 'hunter2'  # heh
