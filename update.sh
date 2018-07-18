#automatically merge SASS changes
node-sass staticfiles/home/style.scss -o staticfiles/home/css 2>&1

if [ $? -eq 0 ]; then
  echo 'SASS finished successfully.'
fi

#start django server
echo 'Starting Django server...'
python manage.py runserver
