create table orders
(
    id           uuid primary key,
    total_amount decimal(10, 2) not null
);

create table order_items
(
    id              uuid primary key,
    order_id        uuid           not null,
    product_id      varchar(255)   not null,
    product_edition varchar(255)   not null,
    product_price   decimal(10, 2) not null
)
