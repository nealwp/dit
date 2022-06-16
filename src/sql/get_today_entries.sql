select rowid, description, date_added 
from task
where date(date_added, 'localtime') = date(date('now'), 'localtime');