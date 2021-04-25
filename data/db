--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-26 00:06:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16397)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id_user bigint NOT NULL,
    email character varying(63) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(63) NOT NULL,
    language character varying(15) NOT NULL,
    theme character varying(63) NOT NULL,
    hide_email boolean NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16395)
-- Name: user_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_user_seq OWNER TO postgres;

--
-- TOC entry 2990 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_user_seq OWNED BY public."user".id_user;


--
-- TOC entry 2850 (class 2604 OID 16400)
-- Name: user id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);


--
-- TOC entry 2984 (class 0 OID 16397)
-- Dependencies: 201
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id_user, email, password, username, language, theme, hide_email) FROM stdin;
1	kotek@gmail.com	kocica50	piesek60	pl	dark	t
2	haha@test.com	$2b$10$cV2JX1lAgubdgUHK/oVNVe4LueFQ8DjsF.H9YXDBEa6WspoW7v6hK	test	en	dark	f
3	haha2@test.com	$2b$10$b1AM0Ais2to7/finjwYVCepJbjk4Y7fiz.Lt1LE0babxuLFCGwxOa	test2	en	dark	f
4	haha23@test.com	$2b$10$aI0VLilSnbwChZlZrPHHTOu18eEWZxoFAZtbcp/9jZGy1Jw61opcO	test23	en	dark	f
5	haha234@test.com	$2b$10$oGtse/f..ceNl7FX7vPvoeURGfJO9N0DEW24HvS3UiMYFK17aN/oW	test234	en	dark	f
6	test90@gmail.com	$2b$10$6TKaBY7TltPgssGeQ9ZSYOYxT1X/oCN1.x5zfvm7qXsKeyv8Z2SjO	test90	pl	dark	f
\.


--
-- TOC entry 2991 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_user_seq', 6, true);


--
-- TOC entry 2852 (class 2606 OID 16402)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


-- Completed on 2021-04-26 00:06:01

--
-- PostgreSQL database dump complete
--

