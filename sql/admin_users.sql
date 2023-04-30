create database admin_users;
use admin_users;

create table roles(
	id_roles int primary key not null auto_increment,
	roles_name varchar(255) not null,
	description varchar(255) not null
);

create table users(
	id_user varchar(30) primary key not null,
    username varchar(155) not null,
	name varchar(155) not null,
	second_name varchar(155) not null,
    email varchar(155) not null,
	password  varchar(155) not null,
    id_roles int not null,
    foreign key (id_roles) references roles(id_roles)
);

create table questions(
	id_question int primary key auto_increment not null,
    id_user varchar(30) not null,
    ask text,
    answer text
);

insert into roles(roles_name,description) values ('Administrador_general','puede hacer todas las funciones');
insert into roles(roles_name,description) values ('Administrador_cartas','funciones que tengan que ver con cartas');
insert into roles(roles_name,description) values ('Administrador_negocio','funciones que tengan que ver con el negocio');
insert into roles(roles_name,description) values ('Jugador','funciones del jugador');