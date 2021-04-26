// React & Next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import RegisterForm from "../components/auth/RegisterForm";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "register"])),
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
