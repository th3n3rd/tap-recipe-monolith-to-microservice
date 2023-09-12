create table pricing
(
    id serial primary key,
    product_id varchar(255) not null,
    price decimal(10, 2) not null
);

insert into pricing(id, product_id, price) values (1, 'eicher', 58.00);
insert into pricing(id, product_id, price) values (3, 'fendt', 54.00);
insert into pricing(id, product_id, price) values (5, 'porsche', 66.00);
