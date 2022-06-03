select rowid, description, date_added 
from task
where date_added = date('now');