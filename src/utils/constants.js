/**
 * Application Constants
 * 
 * Single source of truth for all constant values.
 */

export const ROLES = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    VIEWER: 'VIEWER',
    SUPER_ADMIN: 'SUPER_ADMIN'
};

export const LEAD_STATES = {
    DISCOVERED: 'DISCOVERED',
    CONTACTED: 'CONTACTED',
    RESPONDED: 'RESPONDED',
    QUALIFIED: 'QUALIFIED',
    MEETING_PROPOSED: 'MEETING_PROPOSED',
    MEETING_BOOKED: 'MEETING_BOOKED',
    CLOSED_LOST: 'CLOSED_LOST',
    ESCALATED: 'ESCALATED',
    STOPPED: 'STOPPED',
    BOUNCED: 'BOUNCED',
    ERROR: 'ERROR'
};

export const MEETING_STATUS = {
    SCHEDULED: 'SCHEDULED',
    CONFIRMED: 'CONFIRMED',
    ATTENDED: 'ATTENDED',
    NO_SHOW: 'NO_SHOW',
    CANCELLED: 'CANCELLED'
};

export const EXECUTION_STATUS = {
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED'
};

export const PRICING_TIERS = {
    STARTER: {
        name: 'STARTER',
        price: 1999,
        meetings: 10,
        features: ['Basic automation', 'Standard queue']
    },
    GROWTH: {
        name: 'GROWTH',
        price: 4999,
        meetings: 30,
        features: ['Faster replies', 'Priority queue']
    },
    SCALE: {
        name: 'SCALE',
        price: 9999,
        meetings: 100,
        features: ['High volume', 'Custom sender infra', 'SLA-backed']
    },
    ENTERPRISE: {
        name: 'ENTERPRISE',
        price: 100000,
        meetings: 999,
        features: ['White-label', 'Dedicated infra', 'Compliance logs']
    }
};

export const STATE_COLORS = {
    DISCOVERED: 'secondary',
    CONTACTED: 'info',
    RESPONDED: 'primary',
    QUALIFIED: 'success',
    MEETING_PROPOSED: 'warning',
    MEETING_BOOKED: 'success',
    CLOSED_LOST: 'danger',
    ESCALATED: 'warning',
    STOPPED: 'dark',
    BOUNCED: 'danger',
    ERROR: 'danger',
    RUNNING: 'success',
    PAUSED: 'warning'
};

export const MEETING_COLORS = {
    SCHEDULED: 'info',
    CONFIRMED: 'primary',
    ATTENDED: 'success',
    NO_SHOW: 'danger',
    CANCELLED: 'secondary'
};
