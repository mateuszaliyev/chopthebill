PGDMP                         y           chopthebill    13.2    13.2 ?    ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    17575    chopthebill    DATABASE     g   CREATE DATABASE chopthebill WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Polish_Poland.1250';
    DROP DATABASE chopthebill;
                postgres    false            ?            1259    17600    affiliation    TABLE     ?   CREATE TABLE public.affiliation (
    id_affiliation bigint NOT NULL,
    owner boolean NOT NULL,
    valid boolean NOT NULL,
    id_user bigint NOT NULL,
    id_group bigint NOT NULL
);
    DROP TABLE public.affiliation;
       public         heap    postgres    false            ?            1259    17598    affiliation_id_affiliation_seq    SEQUENCE     ?   CREATE SEQUENCE public.affiliation_id_affiliation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.affiliation_id_affiliation_seq;
       public          postgres    false    205            ?           0    0    affiliation_id_affiliation_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.affiliation_id_affiliation_seq OWNED BY public.affiliation.id_affiliation;
          public          postgres    false    204            ?            1259    17618    expense    TABLE     b  CREATE TABLE public.expense (
    id_expense bigint NOT NULL,
    title character varying(63) NOT NULL,
    description text,
    date timestamp with time zone NOT NULL,
    amount bigint NOT NULL,
    currency character varying(3) NOT NULL,
    settled boolean NOT NULL,
    deleted boolean NOT NULL,
    id_user bigint NOT NULL,
    id_group bigint
);
    DROP TABLE public.expense;
       public         heap    postgres    false            ?            1259    17616    expense_id_expense_seq    SEQUENCE        CREATE SEQUENCE public.expense_id_expense_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.expense_id_expense_seq;
       public          postgres    false    207                        0    0    expense_id_expense_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.expense_id_expense_seq OWNED BY public.expense.id_expense;
          public          postgres    false    206            ?            1259    17639 
   friendship    TABLE     ?   CREATE TABLE public.friendship (
    id_friendship bigint NOT NULL,
    valid boolean NOT NULL,
    id_user_1 bigint NOT NULL,
    id_user_2 bigint NOT NULL
);
    DROP TABLE public.friendship;
       public         heap    postgres    false            ?            1259    17637    friendship_id_friendship_seq    SEQUENCE     ?   CREATE SEQUENCE public.friendship_id_friendship_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.friendship_id_friendship_seq;
       public          postgres    false    209                       0    0    friendship_id_friendship_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.friendship_id_friendship_seq OWNED BY public.friendship.id_friendship;
          public          postgres    false    208            ?            1259    17589    group    TABLE     ?   CREATE TABLE public."group" (
    id_group bigint NOT NULL,
    name character varying(63) NOT NULL,
    description text,
    deleted boolean NOT NULL
);
    DROP TABLE public."group";
       public         heap    postgres    false            ?            1259    17587    group_id_group_seq    SEQUENCE     {   CREATE SEQUENCE public.group_id_group_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.group_id_group_seq;
       public          postgres    false    203                       0    0    group_id_group_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.group_id_group_seq OWNED BY public."group".id_group;
          public          postgres    false    202            ?            1259    17657    notification    TABLE     ?   CREATE TABLE public.notification (
    id_notification bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    redirect text NOT NULL,
    read boolean NOT NULL,
    id_user bigint NOT NULL
);
     DROP TABLE public.notification;
       public         heap    postgres    false            ?            1259    17655     notification_id_notification_seq    SEQUENCE     ?   CREATE SEQUENCE public.notification_id_notification_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.notification_id_notification_seq;
       public          postgres    false    211                       0    0     notification_id_notification_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.notification_id_notification_seq OWNED BY public.notification.id_notification;
          public          postgres    false    210            ?            1259    17673 
   obligation    TABLE       CREATE TABLE public.obligation (
    id_obligation bigint NOT NULL,
    amount bigint NOT NULL,
    settled boolean NOT NULL,
    deleted boolean NOT NULL,
    id_user_debtor bigint NOT NULL,
    id_user_creditor bigint NOT NULL,
    id_expense bigint NOT NULL
);
    DROP TABLE public.obligation;
       public         heap    postgres    false            ?            1259    17671    obligation_id_obligation_seq    SEQUENCE     ?   CREATE SEQUENCE public.obligation_id_obligation_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.obligation_id_obligation_seq;
       public          postgres    false    213                       0    0    obligation_id_obligation_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.obligation_id_obligation_seq OWNED BY public.obligation.id_obligation;
          public          postgres    false    212            ?            1259    17578    user    TABLE     ?  CREATE TABLE public."user" (
    id_user bigint NOT NULL,
    email character varying(63) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(63) NOT NULL,
    language character varying(15) NOT NULL,
    theme character varying(63) NOT NULL,
    avatar boolean NOT NULL,
    hide_email boolean NOT NULL,
    last_seen timestamp with time zone NOT NULL,
    refresh_token character varying(255),
    deleted boolean NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false            ?            1259    17576    user_id_user_seq    SEQUENCE     y   CREATE SEQUENCE public.user_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    201                       0    0    user_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.user_id_user_seq OWNED BY public."user".id_user;
          public          postgres    false    200            L           2604    17603    affiliation id_affiliation    DEFAULT     ?   ALTER TABLE ONLY public.affiliation ALTER COLUMN id_affiliation SET DEFAULT nextval('public.affiliation_id_affiliation_seq'::regclass);
 I   ALTER TABLE public.affiliation ALTER COLUMN id_affiliation DROP DEFAULT;
       public          postgres    false    204    205    205            M           2604    17621    expense id_expense    DEFAULT     x   ALTER TABLE ONLY public.expense ALTER COLUMN id_expense SET DEFAULT nextval('public.expense_id_expense_seq'::regclass);
 A   ALTER TABLE public.expense ALTER COLUMN id_expense DROP DEFAULT;
       public          postgres    false    207    206    207            N           2604    17642    friendship id_friendship    DEFAULT     ?   ALTER TABLE ONLY public.friendship ALTER COLUMN id_friendship SET DEFAULT nextval('public.friendship_id_friendship_seq'::regclass);
 G   ALTER TABLE public.friendship ALTER COLUMN id_friendship DROP DEFAULT;
       public          postgres    false    208    209    209            K           2604    17592    group id_group    DEFAULT     r   ALTER TABLE ONLY public."group" ALTER COLUMN id_group SET DEFAULT nextval('public.group_id_group_seq'::regclass);
 ?   ALTER TABLE public."group" ALTER COLUMN id_group DROP DEFAULT;
       public          postgres    false    202    203    203            O           2604    17660    notification id_notification    DEFAULT     ?   ALTER TABLE ONLY public.notification ALTER COLUMN id_notification SET DEFAULT nextval('public.notification_id_notification_seq'::regclass);
 K   ALTER TABLE public.notification ALTER COLUMN id_notification DROP DEFAULT;
       public          postgres    false    210    211    211            P           2604    17676    obligation id_obligation    DEFAULT     ?   ALTER TABLE ONLY public.obligation ALTER COLUMN id_obligation SET DEFAULT nextval('public.obligation_id_obligation_seq'::regclass);
 G   ALTER TABLE public.obligation ALTER COLUMN id_obligation DROP DEFAULT;
       public          postgres    false    212    213    213            J           2604    17581    user id_user    DEFAULT     n   ALTER TABLE ONLY public."user" ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);
 =   ALTER TABLE public."user" ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    201    200    201            ?          0    17600    affiliation 
   TABLE DATA           V   COPY public.affiliation (id_affiliation, owner, valid, id_user, id_group) FROM stdin;
    public          postgres    false    205   -N       ?          0    17618    expense 
   TABLE DATA           ~   COPY public.expense (id_expense, title, description, date, amount, currency, settled, deleted, id_user, id_group) FROM stdin;
    public          postgres    false    207   JN       ?          0    17639 
   friendship 
   TABLE DATA           P   COPY public.friendship (id_friendship, valid, id_user_1, id_user_2) FROM stdin;
    public          postgres    false    209   gN       ?          0    17589    group 
   TABLE DATA           G   COPY public."group" (id_group, name, description, deleted) FROM stdin;
    public          postgres    false    203   ?N       ?          0    17657    notification 
   TABLE DATA           d   COPY public.notification (id_notification, title, description, redirect, read, id_user) FROM stdin;
    public          postgres    false    211   ?N       ?          0    17673 
   obligation 
   TABLE DATA           {   COPY public.obligation (id_obligation, amount, settled, deleted, id_user_debtor, id_user_creditor, id_expense) FROM stdin;
    public          postgres    false    213   ?N       ?          0    17578    user 
   TABLE DATA           ?   COPY public."user" (id_user, email, password, username, language, theme, avatar, hide_email, last_seen, refresh_token, deleted) FROM stdin;
    public          postgres    false    201   ?N                  0    0    affiliation_id_affiliation_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.affiliation_id_affiliation_seq', 1, false);
          public          postgres    false    204                       0    0    expense_id_expense_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.expense_id_expense_seq', 1, false);
          public          postgres    false    206                       0    0    friendship_id_friendship_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.friendship_id_friendship_seq', 1, false);
          public          postgres    false    208            	           0    0    group_id_group_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.group_id_group_seq', 1, false);
          public          postgres    false    202            
           0    0     notification_id_notification_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.notification_id_notification_seq', 1, false);
          public          postgres    false    210                       0    0    obligation_id_obligation_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.obligation_id_obligation_seq', 1, false);
          public          postgres    false    212                       0    0    user_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_id_user_seq', 1, false);
          public          postgres    false    200            V           2606    17605    affiliation affiliation_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.affiliation
    ADD CONSTRAINT affiliation_pkey PRIMARY KEY (id_affiliation);
 F   ALTER TABLE ONLY public.affiliation DROP CONSTRAINT affiliation_pkey;
       public            postgres    false    205            X           2606    17626    expense expense_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id_expense);
 >   ALTER TABLE ONLY public.expense DROP CONSTRAINT expense_pkey;
       public            postgres    false    207            Z           2606    17644    friendship friendship_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_pkey PRIMARY KEY (id_friendship);
 D   ALTER TABLE ONLY public.friendship DROP CONSTRAINT friendship_pkey;
       public            postgres    false    209            T           2606    17597    group group_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id_group);
 <   ALTER TABLE ONLY public."group" DROP CONSTRAINT group_pkey;
       public            postgres    false    203            \           2606    17665    notification notification_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notification);
 H   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_pkey;
       public            postgres    false    211            ^           2606    17678    obligation obligation_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_pkey PRIMARY KEY (id_obligation);
 D   ALTER TABLE ONLY public.obligation DROP CONSTRAINT obligation_pkey;
       public            postgres    false    213            R           2606    17586    user user_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    201            `           2606    17611 %   affiliation affiliation_id_group_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.affiliation
    ADD CONSTRAINT affiliation_id_group_fkey FOREIGN KEY (id_group) REFERENCES public."group"(id_group);
 O   ALTER TABLE ONLY public.affiliation DROP CONSTRAINT affiliation_id_group_fkey;
       public          postgres    false    203    2900    205            _           2606    17606 $   affiliation affiliation_id_user_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.affiliation
    ADD CONSTRAINT affiliation_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id_user);
 N   ALTER TABLE ONLY public.affiliation DROP CONSTRAINT affiliation_id_user_fkey;
       public          postgres    false    205    201    2898            b           2606    17632    expense expense_id_group_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_id_group_fkey FOREIGN KEY (id_group) REFERENCES public."group"(id_group);
 G   ALTER TABLE ONLY public.expense DROP CONSTRAINT expense_id_group_fkey;
       public          postgres    false    203    2900    207            a           2606    17627    expense expense_id_user_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id_user);
 F   ALTER TABLE ONLY public.expense DROP CONSTRAINT expense_id_user_fkey;
       public          postgres    false    207    201    2898            c           2606    17645 $   friendship friendship_id_user_1_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_id_user_1_fkey FOREIGN KEY (id_user_1) REFERENCES public."user"(id_user);
 N   ALTER TABLE ONLY public.friendship DROP CONSTRAINT friendship_id_user_1_fkey;
       public          postgres    false    209    2898    201            d           2606    17650 $   friendship friendship_id_user_2_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT friendship_id_user_2_fkey FOREIGN KEY (id_user_2) REFERENCES public."user"(id_user);
 N   ALTER TABLE ONLY public.friendship DROP CONSTRAINT friendship_id_user_2_fkey;
       public          postgres    false    2898    209    201            e           2606    17666 &   notification notification_id_user_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id_user);
 P   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_id_user_fkey;
       public          postgres    false    201    2898    211            h           2606    17689 %   obligation obligation_id_expense_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_id_expense_fkey FOREIGN KEY (id_expense) REFERENCES public.expense(id_expense);
 O   ALTER TABLE ONLY public.obligation DROP CONSTRAINT obligation_id_expense_fkey;
       public          postgres    false    207    2904    213            g           2606    17684 +   obligation obligation_id_user_creditor_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_id_user_creditor_fkey FOREIGN KEY (id_user_creditor) REFERENCES public."user"(id_user);
 U   ALTER TABLE ONLY public.obligation DROP CONSTRAINT obligation_id_user_creditor_fkey;
       public          postgres    false    2898    213    201            f           2606    17679 )   obligation obligation_id_user_debtor_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.obligation
    ADD CONSTRAINT obligation_id_user_debtor_fkey FOREIGN KEY (id_user_debtor) REFERENCES public."user"(id_user);
 S   ALTER TABLE ONLY public.obligation DROP CONSTRAINT obligation_id_user_debtor_fkey;
       public          postgres    false    2898    213    201            ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?     