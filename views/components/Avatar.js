// React & Next
import { useEffect, useState } from "react";

// Material UI
import { Avatar as MuiAvatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Config
import { host } from "../config";

// Hooks
import useTextToColor from "./hooks/useTextToColor";

// Styles
const useStyles = makeStyles((theme) => ({
	avatar: (props) => ({
		backgroundColor: props.color,
		color: theme.palette.getContrastText(props.color),
	}),
}));

function Avatar({ alt, className, src, user = null, ...props }) {
	const [color, setColor] = useState(useTextToColor(alt));
	const classes = useStyles({ color });

	const avatarAlt = user?.username
		? user.username.toUpperCase()[0]
		: alt
		? alt.toUpperCase()[0]
		: null;

	const avatarSrc = user
		? user.avatar
			? `${host}/avatars/${user.id}`
			: null
		: src
		? src
		: null;

	useEffect(() => {
		user?.username && setColor(useTextToColor(user?.username));
	}, [user?.username]);

	return (
		<MuiAvatar
			alt={avatarAlt}
			className={`${className} ${classes.avatar}`}
			src={avatarSrc}
			{...props}
		>
			{avatarAlt}
		</MuiAvatar>
	);
}

export default Avatar;
