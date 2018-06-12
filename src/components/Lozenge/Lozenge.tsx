import { transparentize } from 'polished';
import styled from 'styled-components';

const getColor = (appearance) => {
	switch (appearance) {
	case 'success': return '#006644';
	case 'removed': return '#BF2600';
	case 'inprogress': return '#0747A6';
	case 'new': return '#403294';
	case 'moved': return '#344563';
	default: return '#42526E';
	}
};

const getBackgroundColor = (appearance) => {
	switch (appearance) {
	case 'success': return '#E3FCEF';
	case 'removed': return '#FFEBE6';
	case 'inprogress': return '#DEEBFF';
	case 'new': return '#EAE6FF';
	case 'moved': return '#FFFAE6';
	default: return '#F4F5F7';
	}
};

interface Props {
	appearance: 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';
	bg?: string;
}
export default styled<Props, 'span'>('span')`
	background-color: ${({ appearance, bg }) => bg ? transparentize(0.75, bg) : getBackgroundColor(appearance)};
	border-radius: 3px;
	color: ${({ appearance, bg }) => bg || getColor(appearance)};
	display: inline-block;
	font-size: 0.785rem;
	font-weight: 700;
	line-height: 1;
	max-width: 200px;
	overflow: hidden;
	padding: 3px 4px;
	text-overflow: ellipsis;
	text-transform: uppercase;
	vertical-align: middle;
	white-space: nowrap;
`;
