// Material UI
import { Avatar as MuiAvatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Hooks
import useTextToColor from "./hooks/useTextToColor";

const useStyles = makeStyles((theme) => ({
	avatar: (props) => ({
		backgroundColor: props.color,
		color: theme.palette.getContrastText(props.color),
	}),
}));

function Avatar({ alt, className, src }) {
	const color = useTextToColor(alt);
	const classes = useStyles({ color });

	return src ? (
		<MuiAvatar
			alt={alt.toUpperCase()}
			className={`${className} ${classes.avatar}`}
			src={src}
		></MuiAvatar>
	) : (
		<MuiAvatar
			alt={alt.toUpperCase()}
			className={`${className} ${classes.avatar}`}
		>
			{alt[0].toUpperCase()}
		</MuiAvatar>
	);
}

export default Avatar;
