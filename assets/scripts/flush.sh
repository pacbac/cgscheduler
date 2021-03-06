#script to flush database annually to avoid mem leaks

today=`date +%m%d`
newyears=`date --date="01/01" +%m%d`

if [ "$today" = "$newyears" ]; then
    python manage.py flushdb
    echo "$(date +%m/%d/%Y): DB reset for the year"
else
  echo "$(date +%m/%d/%Y): Checked to see if DB should be reset"
fi
