#automatically merge SASS changes
cd frontend && npm run build-css 2>&1
cd ..

if [ !$? ]; then
  echo 'SASS finished successfully.'
else
  echo 'SASS compilation error'
  exit 1
fi


if [ "$1" = 'react' ]; then
  cd frontend && npm run build

  if [ !$? ]; then
    echo 'Rebuilding frontend...'
    cd ..
  fi

fi

#start django server
echo 'Starting Django server...'
python manage.py runserver
