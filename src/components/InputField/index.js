import { h } from 'preact';

const InputField = ({ id, metric }, { services: { MVCService } }) => (
	<section>
		<input
			type={metric.type}
			placeholder={metric.name}
			value={MVCService.metrics[id] || null}
			margin="normal"
			fullWidth
			helperText={metric.help}
			onInput={MVCService.linkMetrics(id, 'target.value')}
		/>
	</section>
);

export default InputField;