# CGScheduler

A straightforward scheduling web app for my cell group. The scheduler is essentially a custom Excel/GSheets table with some added rules to check if entries are valid to save the moderator some headaches. There are 2 groups of people who use this together. The moderators should have private access to the edits page (the addresses for edits used in the live page are different from the one in the repo), while everyone else will just see the read-only table.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Python 3.6+, Django
- Other Python dependencies are listed in requirements.txt. Use pip to install them
- Bash for simple, automated scripts (ex. annual DB cleanup)

### Installing and Running

Fork the repo, then clone your fork with ```git clone```.
Make sure to have a ```.env``` file to plug in private variables into Django.
The ```.env``` file should have the values:
```
SECRET_KEY=[[your secret key here]]
DATABASE_URL=[[your database url here]]
DEBUG=True
```
You can generate a secret key [here](https://www.miniwebtool.com/django-secret-key-generator/).  
If you would instead just like to test with a local SQLite DB, replace the ```DATABASES``` variable in the ```cgscheduler/settings.py``` file to
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'mydatabase',
    }
}
```
Run commands:  
```$ python manage.py makemigrations home``` to generate the script for tables in the database  
```$ python manage.py migrate``` to apply changes to the database  
```$ python manage.py collectstatic``` to collect static CSS/JS files  
```$ python manage.py runserver``` to start local server  

Visit the following URLs:
- Read-only: [localhost:[port]/]()
- Edit page: [localhost:[port]/edit]()

## Built With

* Python Django
* HTML, SCSS, jQuery with ES6
* PostgreSQL
* Heroku
* Shell scripts

## Authors

* **Clayton Chu** - [pacbac](https://github.com/pacbac)
