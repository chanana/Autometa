# This is a copy of the local_settings.py file. This is used to store sensitive
# and machine specific information such as passwords and keys. Once the you have
# the values you'd like, rename (or duplicate) this file to "local_settings.py"
# and the "settings.py" file should import the relevant settings from this file.

database_engine = "django.db.backends.sqlite3"
database_name = 'db.sqlite3'

# Not used for sqlite3 databases
# database_user = "project"
# database_password = "abcdefg"
# database_host = "localhost"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

# default redirect url once user logs in
login_redirect_url = 'startpage-home'

static_url = '/static/'
crispy_template_pack = 'bootstrap4'

debug = True
allowed_hosts = []

installed_apps = []

# SECURITY WARNING: keep the secret key used in production secret!
secret_key = ''
