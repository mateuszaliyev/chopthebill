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

function Avatar({ alt = "default", className, src, user = null }) {
	const [color, setColor] = useState(useTextToColor(alt));
	const classes = useStyles({ color });

	useEffect(() => {
		user && setColor(useTextToColor(user.username));
	}, [user]);

	return user ? (
		<MuiAvatar
			alt={user.username.toUpperCase()}
			className={`${className} ${classes.avatar}`}
			src={`${host}/avatars/${user.id}`}
		/>
	) : src ? (
		<MuiAvatar
			alt={alt.toUpperCase()}
			className={`${className} ${classes.avatar}`}
			src={src}
		/>
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
