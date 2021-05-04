// Material UI
import { Avatar as MuiAvatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	avatar: (props) => ({
		backgroundColor: props.color,
		color: theme.palette.getContrastText(props.color),
	}),
}));

function Avatar({ alt, className, color, src }) {
	const classes = useStyles({ color });

	return (
		<MuiAvatar
			alt={alt.toUpperCase()}
			className={`${className} ${classes.avatar}`}
			src={src}
		></MuiAvatar>
	);
}

export default Avatar;
