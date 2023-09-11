create table greetings
(
    id      bigint primary key,
    message varchar(255) not null
);

insert into greetings(id, message) values (1, 'Hello World!');
insert into greetings(id, message) values (2, 'Ciao Mondo!');
insert into greetings(id, message) values (3, 'Bonjour Le Monde!');
