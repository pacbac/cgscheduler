#automatically merge SASS changes
npm run build-css 2>&1

if [ !$? ]; then
  echo 'SASS finished successfully.'
else
  echo 'SASS compilation error'
  exit 1
fi


if [ "$1" = 'react' ]; then
  npm run build

  if [ !$? ]; then
    echo 'Rebuilding frontend...'
  fi
fi

#start django server
echo 'Starting Django server...'
python manage.py runserver
