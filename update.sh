#automatically merge SASS changes
node-sass assets/styles/style.scss -o staticfiles/home/css 2>&1

if [ $? -eq 0 ]; then
  echo 'SASS finished successfully.'
else
  echo 'SASS compilation error'
  exit 1
fi

#start django server
echo 'Starting Django server...'
python manage.py runserver
