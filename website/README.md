# How to Start a Local Instance of the Autometa Website

### 1. Clone the project
```bash
git clone git@github.com:KwanLab/Autometa.git
cd Autometa
```

### 2. Create a virtual environment and source it
```bash
conda create --name autometa --file requirements.txt
conda activate autometa
```
if the environment already exists, just install the extra packages needed using:

```bash
conda install --file requirements.txt
```

### 3. Create a `local_settings.py` file
```bash
# change into the website directory, assuming you're already inside of the repo
cd website

# copy the local settings template 
cp local_settings_template.py local_settings.py

# secret_key.py will be created upon first run (look inside settings.py for details)
```
### 4. Create Databases
```bash
# migrate db
python manage.py migrate

# create an admin account
python manage.py createsuperuser

# save your changes
python manage.py makemigrations website
python manage.py migrate

# run the server
python manage.py runserver
```

### 5. View your website
Your website should be running at `127.0.0.1:8000` by default. If there are errors, they are usually informative.