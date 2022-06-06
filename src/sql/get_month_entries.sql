select description, date_added
from task
where date_added between date('now', 'start of month') and date('now')