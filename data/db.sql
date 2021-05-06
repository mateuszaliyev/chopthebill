-- Database: chopthebill

-- DROP DATABASE chopthebill;

CREATE DATABASE chopthebill
	WITH 
	OWNER = postgres
	ENCODING = 'UTF8'
	LC_COLLATE = 'Polish_Poland.1250'
	LC_CTYPE = 'Polish_Poland.1250'
	TABLESPACE = pg_default
	CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS public.affiliation;
DROP TABLE IF EXISTS public.expense;
DROP TABLE IF EXISTS public.friendship;
DROP TABLE IF EXISTS public.group;
DROP TABLE IF EXISTS public.notification;
DROP TABLE IF EXISTS public.obligation;
DROP TABLE IF EXISTS public.user;

-- Table: public.affiliation

-- DROP TABLE public.affiliation;

CREATE TABLE public.affiliation
(
	id_affiliation bigint NOT NULL DEFAULT nextval('affiliation_id_affiliation_seq'::regclass),
	owner boolean NOT NULL,
	valid boolean NOT NULL,
	id_user bigint NOT NULL,
	id_group bigint NOT NULL,
	CONSTRAINT affiliation_pkey PRIMARY KEY (id_affiliation)
)

TABLESPACE pg_default;

ALTER TABLE public.affiliation
	OWNER to postgres;

-- Table: public.expense

-- DROP TABLE public.expense;

CREATE TABLE public.expense
(
	id_expense bigint NOT NULL DEFAULT nextval('expense_id_expense_seq'::regclass),
	name character varying(63) COLLATE pg_catalog."default" NOT NULL,
	description text COLLATE pg_catalog."default",
	date timestamp with time zone NOT NULL,
	value bigint NOT NULL,
	currency character varying(3) COLLATE pg_catalog."default" NOT NULL,
	settled boolean NOT NULL,
	id_user bigint NOT NULL,
	id_group bigint,
	CONSTRAINT expense_pkey PRIMARY KEY (id_expense)
)

TABLESPACE pg_default;

ALTER TABLE public.expense
	OWNER to postgres;

-- Table: public.friendship

-- DROP TABLE public.friendship;

CREATE TABLE public.friendship
(
	id_friendship bigint NOT NULL DEFAULT nextval('friendship_id_friendship_seq'::regclass),
	valid boolean NOT NULL,
	id_user_1 bigint NOT NULL,
	id_user_2 bigint NOT NULL,
	CONSTRAINT friendship_pkey PRIMARY KEY (id_friendship)
)

TABLESPACE pg_default;

ALTER TABLE public.friendship
	OWNER to postgres;

-- Table: public.group

-- DROP TABLE public."group";

CREATE TABLE public."group"
(
	id_group bigint NOT NULL DEFAULT nextval('group_id_group_seq'::regclass),
	name character varying(63) COLLATE pg_catalog."default" NOT NULL,
	description text COLLATE pg_catalog."default",
	deleted boolean NOT NULL,
	CONSTRAINT group_pkey PRIMARY KEY (id_group)
)

TABLESPACE pg_default;

ALTER TABLE public."group"
	OWNER to postgres;

-- Table: public.notification

-- DROP TABLE public.notification;

CREATE TABLE public.notification
(
	id_notification bigint NOT NULL DEFAULT nextval('notification_id_notification_seq'::regclass),
	title character varying(255) COLLATE pg_catalog."default" NOT NULL,
	description text COLLATE pg_catalog."default",
	redirect text COLLATE pg_catalog."default" NOT NULL,
	read boolean NOT NULL,
	id_user bigint NOT NULL,
	CONSTRAINT notification_pkey PRIMARY KEY (id_notification)
)

TABLESPACE pg_default;

ALTER TABLE public.notification
	OWNER to postgres;

-- Table: public.obligation

-- DROP TABLE public.obligation;

CREATE TABLE public.obligation
(
    id_obligation bigint NOT NULL DEFAULT nextval('obligation_id_obligation_seq'::regclass),
    value bigint NOT NULL,
    settled boolean NOT NULL,
    id_user_debtor bigint NOT NULL,
    id_user_creditor bigint NOT NULL,
    id_expense bigint NOT NULL,
    CONSTRAINT obligation_pkey PRIMARY KEY (id_obligation)
)

TABLESPACE pg_default;

ALTER TABLE public.obligation
    OWNER to postgres;

-- Table: public.user

-- DROP TABLE public."user";

CREATE TABLE public."user"
(
	id_user bigint NOT NULL DEFAULT nextval('user_id_user_seq'::regclass),
	email character varying(63) COLLATE pg_catalog."default" NOT NULL,
	password character varying(255) COLLATE pg_catalog."default" NOT NULL,
	username character varying(63) COLLATE pg_catalog."default" NOT NULL,
	language character varying(15) COLLATE pg_catalog."default" NOT NULL,
	theme character varying(63) COLLATE pg_catalog."default" NOT NULL,
	hide_email boolean NOT NULL,
	last_seen timestamp with time zone NOT NULL,
	refresh_token character varying(255) COLLATE pg_catalog."default",
	deleted boolean NOT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id_user)
)

TABLESPACE pg_default;

ALTER TABLE public."user"
	OWNER to postgres;