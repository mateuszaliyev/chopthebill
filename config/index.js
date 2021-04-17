const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT, 10) || 3000;

export const host = dev
	? `http://localhost:${port}` //  development
	: `http://localhost:${port}`; // production
