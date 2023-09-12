create table products
(
    id               varchar(255) primary key,
    model            varchar(255) not null,
    image_url         varchar(255) not null,
    platinum_image_url varchar(255) not null
);

insert into products(id, model, image_url, platinum_image_url) values ('eicher', 'Eicher Diesel 215/16', 'https://mi-fr.org/img/eicher_standard.svg', 'https://mi-fr.org/img/eicher_platinum.svg');
insert into products(id, model, image_url, platinum_image_url) values ('fendt', 'Fendt F20 Dieselroß', 'https://mi-fr.org/img/fendt_standard.svg', 'https://mi-fr.org/img/fendt_platinum.svg');
insert into products(id, model, image_url, platinum_image_url) values ('porsche', 'Porsche-Diesel Master 419', 'https://mi-fr.org/img/porsche_standard.svg', 'https://mi-fr.org/img/porsche_platinum.svg');
