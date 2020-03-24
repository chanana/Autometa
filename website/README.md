# How to Start a Local Instance of the Autometa Website

### 1. Clone the project
```bash
git clone git@github.com:KwanLab/Autometa.git
cd Autometa
```

### 2. Environment and dependencies
```bash
conda create --name autometa --file requirements.txt
conda activate autometa

# if the environment already exists, just install the extra packages needed using:
conda install --file requirements.txt

# install django_tables2
pip install django_tables2
```

### 3. Database management

##### ADD THE FOLLOWING TO README PROPERLY; DATABASE MANAGEMENT IS A <GRAWLIX>
TODO: add how to setup env variable `$PGDATA` following [this guide](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#macos-and-linux)

[website that has been a good resource](http://ccbv.co.uk)

answer that helped a TON: https://stackoverflow.com/questions/22975936/postgres-fatal-database-does-not-exist-django/22975979

```bash
$PGDATA=/Users/schanana/Documents/Autometa/website/db
pg_ctl --pgdata "$PGDATA" --log "$PGDATA/logfile" start
createuser --createdb --superuser --createrole autometa
psql postgres
```
```psql
postgres=# CREATE DATABASE autometa OWNER autometa;

```

```bash
# Install PostgreSQL
conda install -c anaconda postgresql

# make a database directory
mkdir -p db

# initialize the database directory
initdb -D ./db
```
```bash
# start the postgres server
pg_ctl \
    --pgdata ./db \
    --log ./db/logfile \
    start
```
```bash
# check status of postgres database server
pg_ctl status

pg_ctl: server is running (PID: 15230)
/path/to/postgres/executable "-D" "./db"
```

```bash
# migrate db
python manage.py migrate

# create an admin account
python manage.py createsuperuser

# run the server
python manage.py runserver
```

### 4. Initialize local settings

```bash
# go to the website directory, assuming you're already inside of the repo
cd website

# copy the local settings template 
cp local_settings_template.py local_settings.py

# secret_key.py will be created upon first run (look inside settings.py for details)
```

### 5. View your website
Your website should be running at `127.0.0.1:8000` by default. If there are errors, they are usually informative since it's in debug mode.
