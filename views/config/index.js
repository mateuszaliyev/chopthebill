const dev = process.env.NODE_ENV !== "production";

export const host = dev
	? `http://localhost:5000` //  development
	: `http://localhost:5000`; // production
