PGDMP     0                    y           chopthebill    13.2    13.2 5    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16395    chopthebill    DATABASE     g   CREATE DATABASE chopthebill WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Polish_Poland.1250';
    DROP DATABASE chopthebill;
                postgres    false            �            1259    16909    affiliation    TABLE     �   CREATE TABLE public.affiliation (
    id_affiliation bigint NOT NULL,
    owner boolean NOT NULL,
    valid boolean NOT NULL,
    id_user bigint NOT NULL,
    id_group bigint NOT NULL
);
    DROP TABLE public.affiliation;
       public         heap    postgres    false            �            1259    16912    affiliation_id_affiliation_seq    SEQUENCE     �   CREATE SEQUENCE public.affiliation_id_affiliation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.affiliation_id_affiliation_seq;
       public          postgres    false    201            �           0    0    affiliation_id_affiliation_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.affiliation_id_affiliation_seq OWNED BY public.affiliation.id_affiliation;
          public          postgres    false    202            �            1259    16914    expense    TABLE     B  CREATE TABLE public.expense (
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
    DROP TABLE public.expense;
       public         heap    postgres    false            �            1259    16920    expense_id_expense_seq    SEQUENCE        CREATE SEQUENCE public.expense_id_expense_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.expense_id_expense_seq;
       public          postgres    false    203            �           0    0    expense_id_expense_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.expense_id_expense_seq OWNED BY public.expense.id_expense;
          public          postgres    false    204            �            1259    16922 
   friendship    TABLE     �   CREATE TABLE public.friendship (
    id_friendship bigint NOT NULL,
    valid boolean NOT NULL,
    id_user_1 bigint NOT NULL,
    id_user_2 bigint NOT NULL
);
    DROP TABLE public.friendship;
       public         heap    postgres    false            �            1259    16925    friendship_id_friendship_seq    SEQUENCE     �   CREATE SEQUENCE public.friendship_id_friendship_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.friendship_id_friendship_seq;
       public          postgres    false    205            �           0    0    friendship_id_friendship_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.friendship_id_friendship_seq OWNED BY public.friendship.id_friendship;
          public          postgres    false    206            �            1259    16927    group    TABLE     �   CREATE TABLE public."group" (
    id_group bigint NOT NULL,
    name character varying(63) NOT NULL,
    description text,
    deleted boolean NOT NULL
);
    DROP TABLE public."group";
       public         heap    postgres    false            �            1259    16933    group_id_group_seq    SEQUENCE     {   CREATE SEQUENCE public.group_id_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.group_id_group_seq;
       public          postgres    false    207            �           0    0    group_id_group_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.group_id_group_seq OWNED BY public."group".id_group;
          public          postgres    false    208            �            1259    16891    notification    TABLE     �   CREATE TABLE public.notification (
    id_notification bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    redirect text NOT NULL,
    read boolean NOT NULL,
    id_user bigint NOT NULL
);
     DROP TABLE public.notification;
       public         heap    postgres    false            �            1259    16935     notification_id_notification_seq    SEQUENCE     �   CREATE SEQUENCE public.notification_id_notification_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.notification_id_notification_seq;
       public          postgres    false    200            �           0    0     notification_id_notification_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.notification_id_notification_seq OWNED BY public.notification.id_notification;
          public          postgres    false    209            �            1259    16937 
   obligation    TABLE     �   CREATE TABLE public.obligation (
    id_obligation bigint NOT NULL,
    value bigint NOT NULL,
    settled boolean NOT NULL,
    id_user_debtor bigint NOT NULL,
    id_user_creditor bigint NOT NULL,
    id_expense bigint NOT NULL
);
    DROP TABLE public.obligation;
       public         heap    postgres    false            �            1259    16940    obligation_id_obligation_seq    SEQUENCE     �   CREATE SEQUENCE public.obligation_id_obligation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.obligation_id_obligation_seq;
       public          postgres    false    210            �           0    0    obligation_id_obligation_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.obligation_id_obligation_seq OWNED BY public.obligation.id_obligation;
          public          postgres    false    211            �            1259    16942    user    TABLE     �  CREATE TABLE public."user" (
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
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    16948    user_id_user_seq    SEQUENCE     y   CREATE SEQUENCE public.user_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    212            �           0    0    user_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.user_id_user_seq OWNED BY public."user".id_user;
          public          postgres    false    213            K           2604    16950    affiliation id_affiliation    DEFAULT     �   ALTER TABLE ONLY public.affiliation ALTER COLUMN id_affiliation SET DEFAULT nextval('public.affiliation_id_affiliation_seq'::regclass);
 I   ALTER TABLE public.affiliation ALTER COLUMN id_affiliation DROP DEFAULT;
       public          postgres    false    202    201            L           2604    16951    expense id_expense    DEFAULT     x   ALTER TABLE ONLY public.expense ALTER COLUMN id_expense SET DEFAULT nextval('public.expense_id_expense_seq'::regclass);
 A   ALTER TABLE public.expense ALTER COLUMN id_expense DROP DEFAULT;
       public          postgres    false    204    203            M           2604    16952    friendship id_friendship    DEFAULT     �   ALTER TABLE ONLY public.friendship ALTER COLUMN id_friendship SET DEFAULT nextval('public.friendship_id_friendship_seq'::regclass);
 G   ALTER TABLE public.friendship ALTER COLUMN id_friendship DROP DEFAULT;
       public          postgres    false    206    205            N           2604    16953    group id_group    DEFAULT     r   ALTER TABLE ONLY public."group" ALTER COLUMN id_group SET DEFAULT nextval('public.group_id_group_seq'::regclass);
 ?   ALTER TABLE public."group" ALTER COLUMN id_group DROP DEFAULT;
       public          postgres    false    208    207            J           2604    16954    notification id_notification    DEFAULT     �   ALTER TABLE ONLY public.notification ALTER COLUMN id_notification SET DEFAULT nextval('public.notification_id_notification_seq'::regclass);
 K   ALTER TABLE public.notification ALTER COLUMN id_notification DROP DEFAULT;
       public          postgres    false    209    200            O           2604    16955    obligation id_obligation    DEFAULT     �   ALTER TABLE ONLY public.obligation ALTER COLUMN id_obligation SET DEFAULT nextval('public.obligation_id_obligation_seq'::regclass);
 G   ALTER TABLE public.obligation ALTER COLUMN id_obligation DROP DEFAULT;
       public          postgres    false    211    210            P           2604    16956    user id_user    DEFAULT     n   ALTER TABLE ONLY public."user" ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);
 =   ALTER TABLE public."user" ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    213    212            �          0    16909    affiliation 
   TABLE DATA           V   COPY public.affiliation (id_affiliation, owner, valid, id_user, id_group) FROM stdin;
    public          postgres    false    201   {=       �          0    16914    expense 
   TABLE DATA           s   COPY public.expense (id_expense, name, description, date, value, currency, settled, id_user, id_group) FROM stdin;
    public          postgres    false    203   �=       �          0    16922 
   friendship 
   TABLE DATA           P   COPY public.friendship (id_friendship, valid, id_user_1, id_user_2) FROM stdin;
    public          postgres    false    205   �=       �          0    16927    group 
   TABLE DATA           G   COPY public."group" (id_group, name, description, deleted) FROM stdin;
    public          postgres    false    207   �=       �          0    16891    notification 
   TABLE DATA           d   COPY public.notification (id_notification, title, description, redirect, read, id_user) FROM stdin;
    public          postgres    false    200   �=       �          0    16937 
   obligation 
   TABLE DATA           q   COPY public.obligation (id_obligation, value, settled, id_user_debtor, id_user_creditor, id_expense) FROM stdin;
    public          postgres    false    210   >       �          0    16942    user 
   TABLE DATA           �   COPY public."user" (id_user, email, password, username, language, theme, hide_email, last_seen, refresh_token, deleted) FROM stdin;
    public          postgres    false    212   )>       �           0    0    affiliation_id_affiliation_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.affiliation_id_affiliation_seq', 1, false);
          public          postgres    false    202            �           0    0    expense_id_expense_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.expense_id_expense_seq', 1, false);
          public          postgres    false    204            �           0    0    friendship_id_friendship_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.friendship_id_friendship_seq', 1, false);
          public          postgres    false    206            �           0    0    group_id_group_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.group_id_group_seq', 1, false);
          public          postgres    false    208                        0    0     notification_id_notification_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.notification_id_notification_seq', 1, false);
          public          postgres    false    209                       0    0    obligation_id_obligation_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.obligation_id_obligation_seq', 1, false);
          public          postgres    false    211                       0    0    user_id_user_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.user_id_user_seq', 1, true);
          public          postgres    false    213            T           2606    16958    affiliation affiliation_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id_affiliation);
 F   ALTER TABLE ONLY public.affiliation DROP CONSTRAINT affiliation_pkey;
       public            postgres    false    201            V           2606    16960    expense expense_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id_expense);
 >   ALTER TABLE ONLY public.expense DROP CONSTRAINT expense_pkey;
       public            postgres    false    203            X           2606    16962    friendship friendship_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_pkey PRIMARY KEY (id_friendship);
 D   ALTER TABLE ONLY public.friendship DROP CONSTRAINT friendship_pkey;
       public            postgres    false    205            Z           2606    16964    group group_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id_group);
 <   ALTER TABLE ONLY public."group" DROP CONSTRAINT group_pkey;
       public            postgres    false    207            R           2606    16907    notification notification_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notification);
 H   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_pkey;
       public            postgres    false    200            \           2606    16966    obligation obligation_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_pkey PRIMARY KEY (id_obligation);
 D   ALTER TABLE ONLY public.obligation DROP CONSTRAINT obligation_pkey;
       public            postgres    false    210            ^           2606    16968    user user_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    212            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �     