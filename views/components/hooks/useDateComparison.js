// React & Next
import { useTranslation } from "next-i18next";

function useDateComparison(date1, date2) {
	const { t } = useTranslation("date");

	if (
		typeof date1.getTime !== "function" ||
		typeof date2.getTime !== "function"
	) {
		return null;
	}

	const difference = Math.abs(date1.getTime() - date2.getTime());

	console.log(date1, date2);

	if (difference < 1000 * 60 * 15) {
		return t("date:now");
	}

	if (difference < 1000 * 60 * 60) {
		return `${t("date:minute", {
			count: parseInt(difference / 1000 / 60),
		})} ${t("ago")}`;
	}

	if (difference < 1000 * 60 * 60 * 24) {
		return `${t("date:hour", {
			count: parseInt(difference / 1000 / 60 / 60),
		})} ${t("ago")}`;
	}

	if (difference < 1000 * 60 * 60 * 24 * 30.44) {
		return `${t("date:day", {
			count: parseInt(difference / 1000 / 60 / 60 / 24),
		})} ${t("ago")}`;
	}

	if (difference < 1000 * 60 * 60 * 24 * 365) {
		return `${t("date:month", {
			count: parseInt(difference / 1000 / 60 / 60 / 24 / 30.44),
		})} ${t("ago")}`;
	}

	return `${t("date:year", {
		count: parseInt(difference / 1000 / 60 / 60 / 24 / 365.25),
	})} ${t("ago")}`;
}

export default useDateComparison;
