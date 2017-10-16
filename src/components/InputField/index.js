import { h } from 'preact';

const InputField = ({ id, metric }, { services: { MVCService } }) => {
	return (
		<section>
			<input
				type={metric.type}
				placeholder={metric.name}
				value={MVCService.metrics[id] || null}
				onInput={MVCService.linkMetrics(id, 'target.value')}
			/>
		</section>
	);
};

export default InputField;