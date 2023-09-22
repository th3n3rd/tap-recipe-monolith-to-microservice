alter table order_items add column product_model varchar(255) not null default '';

update order_items set product_model = 'Eicher Diesel 215/16' where product_id = 'eicher';
update order_items set product_model = 'Fendt F20 Dieselroß' where product_id = 'fendt';
update order_items set product_model = 'Porsche-Diesel Master 419' where product_id = 'porsche';
