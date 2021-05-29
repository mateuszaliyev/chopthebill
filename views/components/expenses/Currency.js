// Currencies
import currencies from "../../config/currencies";

function Currency({ amount, code }) {
	const currency = currencies.find((currency) => currency.code === code);

	return (
		<>
			{amount < 0 && "-"}
			{currency.position === "before" && currency.symbol}
			{currency.position === "before" && currency.space && " "}
			{parseFloat(Math.abs(amount) || 0).toFixed(2)}
			{currency.position === "after" && currency.space && " "}
			{currency.position === "after" && currency.symbol}
		</>
	);
}

export default Currency;
