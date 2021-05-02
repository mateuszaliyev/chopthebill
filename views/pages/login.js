// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import LoginForm from "../components/auth/LoginForm";
import Meta from "../components/Meta";
import Redirect from "../components/auth/Redirect";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "login"])),
		},
	};
}

function Login() {
	const { t } = useTranslation(["common", "login"]);

	return (
		<Redirect>
			<Meta title={`${t("login:meta-title")} | ChopTheBill`} />
			<div className="center">
				<main className="auth-container">
					<div className="auth-logo"></div>
					<LoginForm />
				</main>
			</div>
		</Redirect>
	);
}

export default Login;
