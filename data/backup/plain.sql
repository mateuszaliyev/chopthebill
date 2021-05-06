--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-05-06 16:12:10

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
-- TOC entry 201 (class 1259 OID 16909)
-- Name: affiliation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affiliation (
    id_affiliation bigint NOT NULL,
    owner boolean NOT NULL,
    valid boolean NOT NULL,
    id_user bigint NOT NULL,
    id_group bigint NOT NULL
);


ALTER TABLE public.affiliation OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16912)
-- Name: affiliation_id_affiliation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affiliation_id_affiliation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.affiliation_id_affiliation_seq OWNER TO postgres;

--
-- TOC entry 3060 (class 0 OID 0)
-- Dependencies: 202
-- Name: affiliation_id_affiliation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affiliation_id_affiliation_seq OWNED BY public.affiliation.id_affiliation;


--
-- TOC entry 203 (class 1259 OID 16914)
-- Name: expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense (
    id_expense bigint NOT NULL,
    name character varying(63) NOT NULL,
    description text,
    date timestamp with time zone NOT NULL,
    value bigint NOT NULL,
    currency character varying(3) NOT NULL,
    settled boolean NOT NULL,
    id_user bigint NOT NULL,
    id_group bigint
);


ALTER TABLE public.expense OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16920)
-- Name: expense_id_expense_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_id_expense_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.expense_id_expense_seq OWNER TO postgres;

--
-- TOC entry 3061 (class 0 OID 0)
-- Dependencies: 204
-- Name: expense_id_expense_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_id_expense_seq OWNED BY public.expense.id_expense;


--
-- TOC entry 205 (class 1259 OID 16922)
-- Name: friendship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendship (
    id_friendship bigint NOT NULL,
    valid boolean NOT NULL,
    id_user_1 bigint NOT NULL,
    id_user_2 bigint NOT NULL
);


ALTER TABLE public.friendship OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16925)
-- Name: friendship_id_friendship_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friendship_id_friendship_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.friendship_id_friendship_seq OWNER TO postgres;

--
-- TOC entry 3062 (class 0 OID 0)
-- Dependencies: 206
-- Name: friendship_id_friendship_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friendship_id_friendship_seq OWNED BY public.friendship.id_friendship;


--
-- TOC entry 207 (class 1259 OID 16927)
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."group" (
    id_group bigint NOT NULL,
    name character varying(63) NOT NULL,
    description text,
    deleted boolean NOT NULL
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16933)
-- Name: group_id_group_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_id_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_id_group_seq OWNER TO postgres;

--
-- TOC entry 3063 (class 0 OID 0)
-- Dependencies: 208
-- Name: group_id_group_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_id_group_seq OWNED BY public."group".id_group;


--
-- TOC entry 200 (class 1259 OID 16891)
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id_notification bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    redirect text NOT NULL,
    read boolean NOT NULL,
    id_user bigint NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16935)
-- Name: notification_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_notification_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_id_notification_seq OWNER TO postgres;

--
-- TOC entry 3064 (class 0 OID 0)
-- Dependencies: 209
-- Name: notification_id_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_notification_seq OWNED BY public.notification.id_notification;


--
-- TOC entry 210 (class 1259 OID 16937)
-- Name: obligation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.obligation (
    id_obligation bigint NOT NULL,
    value bigint NOT NULL,
    settled boolean NOT NULL,
    id_user_debtor bigint NOT NULL,
    id_user_creditor bigint NOT NULL,
    id_expense bigint NOT NULL
);


ALTER TABLE public.obligation OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16940)
-- Name: obligation_id_obligation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.obligation_id_obligation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.obligation_id_obligation_seq OWNER TO postgres;

--
-- TOC entry 3065 (class 0 OID 0)
-- Dependencies: 211
-- Name: obligation_id_obligation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.obligation_id_obligation_seq OWNED BY public.obligation.id_obligation;


--
-- TOC entry 212 (class 1259 OID 16942)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id_user bigint NOT NULL,
    email character varying(63) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(63) NOT NULL,
    language character varying(15) NOT NULL,
    theme character varying(63) NOT NULL,
    hide_email boolean NOT NULL,
    last_seen timestamp with time zone NOT NULL,
    refresh_token character varying(255),
    deleted boolean NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16948)
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
-- TOC entry 3066 (class 0 OID 0)
-- Dependencies: 213
-- Name: user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_user_seq OWNED BY public."user".id_user;


--
-- TOC entry 2891 (class 2604 OID 16950)
-- Name: affiliation id_affiliation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliation ALTER COLUMN id_affiliation SET DEFAULT nextval('public.affiliation_id_affiliation_seq'::regclass);


--
-- TOC entry 2892 (class 2604 OID 16951)
-- Name: expense id_expense; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense ALTER COLUMN id_expense SET DEFAULT nextval('public.expense_id_expense_seq'::regclass);


--
-- TOC entry 2893 (class 2604 OID 16952)
-- Name: friendship id_friendship; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendship ALTER COLUMN id_friendship SET DEFAULT nextval('public.friendship_id_friendship_seq'::regclass);


--
-- TOC entry 2894 (class 2604 OID 16953)
-- Name: group id_group; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group" ALTER COLUMN id_group SET DEFAULT nextval('public.group_id_group_seq'::regclass);


--
-- TOC entry 2890 (class 2604 OID 16954)
-- Name: notification id_notification; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id_notification SET DEFAULT nextval('public.notification_id_notification_seq'::regclass);


--
-- TOC entry 2895 (class 2604 OID 16955)
-- Name: obligation id_obligation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligation ALTER COLUMN id_obligation SET DEFAULT nextval('public.obligation_id_obligation_seq'::regclass);


--
-- TOC entry 2896 (class 2604 OID 16956)
-- Name: user id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);


--
-- TOC entry 3042 (class 0 OID 16909)
-- Dependencies: 201
-- Data for Name: affiliation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.affiliation (id_affiliation, owner, valid, id_user, id_group) FROM stdin;
\.


--
-- TOC entry 3044 (class 0 OID 16914)
-- Dependencies: 203
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense (id_expense, name, description, date, value, currency, settled, id_user, id_group) FROM stdin;
\.


--
-- TOC entry 3046 (class 0 OID 16922)
-- Dependencies: 205
-- Data for Name: friendship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friendship (id_friendship, valid, id_user_1, id_user_2) FROM stdin;
\.


--
-- TOC entry 3048 (class 0 OID 16927)
-- Dependencies: 207
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."group" (id_group, name, description, deleted) FROM stdin;
\.


--
-- TOC entry 3041 (class 0 OID 16891)
-- Dependencies: 200
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id_notification, title, description, redirect, read, id_user) FROM stdin;
\.


--
-- TOC entry 3051 (class 0 OID 16937)
-- Dependencies: 210
-- Data for Name: obligation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.obligation (id_obligation, value, settled, id_user_debtor, id_user_creditor, id_expense) FROM stdin;
\.


--
-- TOC entry 3053 (class 0 OID 16942)
-- Dependencies: 212
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id_user, email, password, username, language, theme, hide_email, last_seen, refresh_token, deleted) FROM stdin;
\.


--
-- TOC entry 3067 (class 0 OID 0)
-- Dependencies: 202
-- Name: affiliation_id_affiliation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.affiliation_id_affiliation_seq', 1, false);


--
-- TOC entry 3068 (class 0 OID 0)
-- Dependencies: 204
-- Name: expense_id_expense_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_id_expense_seq', 1, false);


--
-- TOC entry 3069 (class 0 OID 0)
-- Dependencies: 206
-- Name: friendship_id_friendship_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friendship_id_friendship_seq', 1, false);


--
-- TOC entry 3070 (class 0 OID 0)
-- Dependencies: 208
-- Name: group_id_group_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_id_group_seq', 1, false);


--
-- TOC entry 3071 (class 0 OID 0)
-- Dependencies: 209
-- Name: notification_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_notification_seq', 1, false);


--
-- TOC entry 3072 (class 0 OID 0)
-- Dependencies: 211
-- Name: obligation_id_obligation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.obligation_id_obligation_seq', 1, false);


--
-- TOC entry 3073 (class 0 OID 0)
-- Dependencies: 213
-- Name: user_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_user_seq', 1, true);


--
-- TOC entry 2900 (class 2606 OID 16958)
-- Name: affiliation affiliation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id_affiliation);


--
-- TOC entry 2902 (class 2606 OID 16960)
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id_expense);


--
-- TOC entry 2904 (class 2606 OID 16962)
-- Name: friendship friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_pkey PRIMARY KEY (id_friendship);


--
-- TOC entry 2906 (class 2606 OID 16964)
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id_group);


--
-- TOC entry 2898 (class 2606 OID 16907)
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notification);


--
-- TOC entry 2908 (class 2606 OID 16966)
-- Name: obligation obligation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_pkey PRIMARY KEY (id_obligation);


--
-- TOC entry 2910 (class 2606 OID 16968)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


-- Completed on 2021-05-06 16:12:10

--
-- PostgreSQL database dump complete
--
