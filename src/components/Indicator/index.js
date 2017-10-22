import { h } from 'preact';
import style from './style';

const Indicator = ({ id, indicator }, { services: { MVCService } }) => {
	let result = MVCService.safeEval(id),
		valid = result !== false;

	if (!valid) return null;

	return (
		<section class={style.indicator}>
			<h3>{ indicator.name }</h3>
			<p>{ indicator.help }</p>
			{ indicator.type === 'number' && <h1>{ result }</h1> }
			{ indicator.type === 'percentage' && <h1>{ parseFloat(result).toFixed(2) }%</h1> }
		</section>
	);
};

export default Indicator;