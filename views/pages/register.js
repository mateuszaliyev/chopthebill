import RegisterForm from "../components/auth/RegisterForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["auth"])),
		},
	};
}

function Register() {
	return (
		<div className="center">
			<main className="auth-container">
				<div className="auth-logo"></div>
				<RegisterForm />
			</main>
		</div>
	);
}

export default Register;
