import LoginForm from "../components/auth/LoginForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["auth"])),
		},
	};
}

function Login() {
	return (
		<div className="center">
			<main className="auth-container">
				<div className="auth-logo"></div>
				<LoginForm />
			</main>
		</div>
	);
}

export default Login;
