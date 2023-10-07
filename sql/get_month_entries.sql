select description, dateAdded
from task
where dateAdded between date('now', 'start of month') and date('now')
