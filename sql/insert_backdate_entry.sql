insert into task 
values (
  $description, date($entrydate)
  ) 
returning rowid;