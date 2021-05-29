const { db } = require("./db");

async function generate() {
	try {
		await db.query(
			`CREATE TABLE public.user
		(
			id_user bigserial NOT NULL,
			email character varying(63) NOT NULL,
			password character varying(255) NOT NULL,
			username character varying(63) NOT NULL,
			language character varying(15) NOT NULL,
			theme character varying(63) NOT NULL,
			hide_email boolean NOT NULL,
			last_seen timestamp with time zone NOT NULL,
			refresh_token character varying(255),
			deleted boolean NOT NULL,
			PRIMARY KEY (id_user)
			);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.group
		(
			id_group bigserial NOT NULL,
			name character varying(63) NOT NULL,
			description text,
			deleted boolean NOT NULL,
			PRIMARY KEY (id_group)
		);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.affiliation
		(
			id_affiliation bigserial NOT NULL,
			owner boolean NOT NULL,
			valid boolean NOT NULL,
			id_user bigint NOT NULL REFERENCES public.user (id_user),
			id_group bigint NOT NULL REFERENCES public.group (id_group),
			PRIMARY KEY (id_affiliation)
		);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.expense
		(
			id_expense bigserial NOT NULL,
			name character varying(63) NOT NULL,
			description text,
			date timestamp with time zone NOT NULL,
			value bigint NOT NULL,
			currency character varying(3) NOT NULL,
			settled boolean NOT NULL,
			id_user bigint NOT NULL REFERENCES public.user (id_user),
			id_group bigint REFERENCES public.group (id_group),
			PRIMARY KEY (id_expense)
		);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.friendship
		(
			id_friendship bigserial NOT NULL,
			valid boolean NOT NULL,
			id_user_1 bigint NOT NULL REFERENCES public.user (id_user),
			id_user_2 bigint NOT NULL REFERENCES public.user (id_user),
			PRIMARY KEY (id_friendship)
		);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.notification
		(
			id_notification bigserial NOT NULL,
			title character varying(255) NOT NULL,
			description text,
			redirect text NOT NULL,
			read boolean NOT NULL,
			id_user bigint NOT NULL REFERENCES public.user (id_user),
			PRIMARY KEY (id_notification)
		);`,
			[]
		);

		await db.query(
			`CREATE TABLE public.obligation
		(
			id_obligation bigserial NOT NULL,
			value bigint NOT NULL,
			settled boolean NOT NULL,
			id_user_debtor bigint NOT NULL REFERENCES public.user (id_user),
			id_user_creditor bigint NOT NULL REFERENCES public.user (id_user),
			id_expense bigint NOT NULL REFERENCES public.expense (id_expense),
			PRIMARY KEY (id_obligation)
		);`,
			[]
		);
	} catch (err) {
		console.error(err.stack);
		process.exit(-1);
	}
}

generate().then(() =>
	console
		.log("Database generated successfully.")
		.catch((err) => console.error(err.stack))
);
