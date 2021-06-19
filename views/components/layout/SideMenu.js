// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../Link";
import Logo from "../Logo";

// Styles
const useStyles = makeStyles((theme) => ({
	list: {
		width: "16rem",
	},
	logo: {
		alignItems: "center",
		display: "flex",
		padding: "0.5rem 0.25rem",
	},
	logoText: {
		marginLeft: "1rem",
	},
}));

function SideMenu({ items }) {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Drawer anchor="left" variant="permanent">
			<div className={classes.logo}>
				<Logo background size={48} />
				<Typography
					className={classes.logoText}
					style={{ cursor: "default" }}
					variant="h5"
				>
					ChopTheBill
				</Typography>
			</div>
			<Divider variant="middle" />
			<List className={classes.list}>
				{items.map((item) => (
					<Link
						color="inherit"
						href={item.href}
						key={item.text}
						underline="none"
					>
						<ListItem button>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={t(item.text)} />
						</ListItem>
					</Link>
				))}
			</List>
		</Drawer>
	);
}

export default SideMenu;
