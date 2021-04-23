import { useState } from "react";
import { host } from "../../config";
import Button from "@material-ui/core/Button";
import { FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		// fetch(`${host}/login`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		email,
		// 		password,
		// 	}),
		// });
	};

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<FormControl>
				<TextField
					id="email"
					label="Email"
					variant="filled"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
				/>

				<TextField
					id="password"
					label="Password"
					variant="filled"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<br />
				<Button variant="contained" type="submit">
					Zaloguj się
				</Button>
				<br />
				<Link href="/">Zapomniałeś hasła?</Link>
				<br />
				<Link href="/">Nie masz konta? Zarejestruj się!</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
