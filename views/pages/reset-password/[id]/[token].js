// React & Next
import { useEffect, useState } from "react";

// Config
import { host } from "../../../config";

// Components
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";
import Loader from "../../../components/Loader";

export async function getServerSideProps(context) {
	const { id, token } = context.query;

	return { props: { id, token } };
}

function ResetPassword({ id, token }) {
	const [validated, setValidated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(async () => {
		const res = await fetch(`${host}/validate-link`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				token,
			}),
		});
		const { error } = await res.json();
		setError(error);
		setLoading(false);
		if (res.ok) {
			setValidated(true);
		}
	}, []);

	return validated ? (
		<ResetPasswordForm />
	) : loading ? (
		<Loader size="4rem" />
	) : (
		error
	);
}

export default ResetPassword;
