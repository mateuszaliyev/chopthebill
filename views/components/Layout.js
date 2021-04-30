// Material UI
import {
	AppBar,
	IconButton,
	Toolbar,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

// Components
import Language from "./Language";
import PaletteButton from "./PaletteButton";
import PaletteList from "./PaletteList";
import SideMenu from "./SideMenu";

// Styles
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

function Layout({ children, title }) {
	const matches = useMediaQuery("(min-width:500px)");
	const classes = useStyles();

	return (
		<>
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<SideMenu className={classes.menuButton} />
						<Typography variant="h6" className={classes.title}>
							{matches ? title : ""}
						</Typography>
						<Language />
						<PaletteList />
						<PaletteButton />
					</Toolbar>
				</AppBar>
			</div>
			{children}
		</>
	);
}

export default Layout;
