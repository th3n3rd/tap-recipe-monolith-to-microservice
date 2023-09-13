alter table pricing add column edition varchar(255) not null default 'standard';

insert into pricing(product_id, edition, price) values ('eicher', 'platinum', 958.00);
insert into pricing(product_id, edition, price) values ('fendt', 'platinum', 954.00);
insert into pricing(product_id, edition, price) values ('porsche', 'platinum', 966.00);
