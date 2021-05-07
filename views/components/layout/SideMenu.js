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
	ListSubheader,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Language from "../Language";
import Link from "../Link";
import Logo from "../Logo";
import PaletteButton from "../PaletteButton";
import PaletteList from "../PaletteList";

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
	const { t } = useTranslation("common");
	const classes = useStyles();

	return (
		<Drawer anchor="left" variant="permanent">
			<div className={classes.logo}>
				<Logo size={48} />
				<Typography className={classes.logoText} variant="h5">
					ChopTheBill
				</Typography>
			</div>
			<Divider variant="middle" />
			<List className={classes.list}>
				{items.map((item) => (
					<Link color="inherit" href={item.href} key={item.text}>
						<ListItem button>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={t(item.text)} />
						</ListItem>
					</Link>
				))}
				<ListSubheader>Temporary Buttons</ListSubheader>
				<ListItem>
					<Language expand />
				</ListItem>
				<ListItem>
					<PaletteList expand />
					<PaletteButton />
				</ListItem>
			</List>
		</Drawer>
	);
}

export default SideMenu;
