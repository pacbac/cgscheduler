today=`date +%m%d`
newyears=`date --date="01/01" +%m%d`

if [ "$today" = "$newyears" ]; then
    python manage.py flush --no-input
    echo 'DB reset for the year'
else
  echo "$(date +%m/%d/%Y): Checked to see if DB should be reset"
fi
