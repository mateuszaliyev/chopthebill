// React & Next
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TranslateIcon from "@material-ui/icons/Translate";

// Components
import Link from "./Link";

function Language({ expand }) {
	const { t } = useTranslation("common");

	const [languageAnchor, setLanguageAnchor] = useState(null);
	const router = useRouter();

	const handleClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setLanguageAnchor(null);
	};

	return (
		<>
			{expand ? (
				<Button
					aria-controls="simple-menu"
					aria-haspopup="true"
					color="inherit"
					endIcon={<ExpandMoreIcon />}
					startIcon={<TranslateIcon />}
					onClick={handleClick}
				>
					{t("language")}
				</Button>
			) : (
				<Tooltip title={t("language")}>
					<IconButton
						aria-controls="simple-menu"
						aria-haspopup="true"
						color="inherit"
						onClick={handleClick}
					>
						<TranslateIcon />
					</IconButton>
				</Tooltip>
			)}
			<Menu
				id="simple-menu"
				anchorEl={languageAnchor}
				keepMounted
				open={Boolean(languageAnchor)}
				onClose={handleClose}
			>
				{router.locales.map((locale) => (
					<MenuItem key={locale} onClick={handleClose}>
						<Link
							color="inherit"
							href={router.asPath}
							locale={locale}
							underline="none"
						>
							{t(locale)}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default Language;
