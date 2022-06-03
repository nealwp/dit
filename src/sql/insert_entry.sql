insert into task 
values (
  $description, date('now')
  ) 
returning rowid;