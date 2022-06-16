select description, date_added
from task
where date_added between date(date('now', 'start of month'), 'localtime') 
and date(date('now'), 'localtime')