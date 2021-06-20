// Currencies
import currencies from "../../config/currencies";

export const getCurrencyString = (amount, code) => {
	const currency = currencies.find((currency) => currency.code === code);
	return `${amount < 0 ? "-" : ""}${
		currency.position === "before" ? currency.symbol : ""
	}${currency.position === "before" && currency.space ? " " : ""}${parseFloat(
		Math.abs(amount) || 0
	).toFixed(2)}${currency.position === "after" && currency.space ? " " : ""}${
		currency.position === "after" ? currency.symbol : ""
	}`;
};

function Currency({ amount, code }) {
	const currency = currencies.find((currency) => currency.code === code);

	return (
		<span>
			{amount < 0 && "-"}
			{currency.position === "before" && currency.symbol}
			{currency.position === "before" && currency.space && "\u00A0"}
			{parseFloat(Math.abs(amount) || 0).toFixed(2)}
			{currency.position === "after" && currency.space && "\u00A0"}
			{currency.position === "after" && currency.symbol}
		</span>
	);
}

export default Currency;
