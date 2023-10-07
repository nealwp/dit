select rowid, description, dateAdded 
from task
where date(dateAdded, 'localtime') = date(date('now'), 'localtime');
