import { api } from './http';

/**
 * Get analytics data
 */
export const getAnalyticsData = () => {
  return api('/analytics/stats');
};