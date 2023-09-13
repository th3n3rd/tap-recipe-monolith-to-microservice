create table pricing
(
    id serial primary key,
    product_id varchar(255) not null,
    price decimal(10, 2) not null
);

insert into pricing(product_id, price) values ('eicher', 58.00);
insert into pricing(product_id, price) values ('fendt', 54.00);
insert into pricing(product_id, price) values ('porsche', 66.00);
