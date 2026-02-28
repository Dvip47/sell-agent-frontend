import { STATE_COLORS } from '../../utils/constants';
import { formatStateName } from '../../utils/formatters';

/**
 * StatusBadge Component
 * 
 * Displays state/status with appropriate Bootstrap color.
 * No custom styling, Bootstrap only.
 */
function StatusBadge({ state, size = 'sm' }) {
    const color = STATE_COLORS[state] || 'secondary';
    const badgeClass = `badge bg-${color} ${size === 'sm' ? 'badge-sm' : ''}`;

    return (
        <span className={badgeClass}>
            {formatStateName(state)}
        </span>
    );
}

export default StatusBadge;
