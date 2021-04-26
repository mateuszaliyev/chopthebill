// React & Next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import LoginForm from "../components/auth/LoginForm";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "login"])),
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
