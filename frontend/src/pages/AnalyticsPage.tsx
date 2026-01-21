import { useEffect, useState } from "react";
import { getAnalyticsData } from "../api/analytics.api";
import type { AnalyticsData } from "../types/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const showData = async () => {
      try {
        const result = await getAnalyticsData();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    showData();
  }, []);

  // if (!data) return <p className="text-center">Loading analytics...</p>;
  if (loading) return <p className="text-center">Loading analytics...</p>;
  if (error) return <p className="text-error">{error}</p>;
  if (!data) return null; 

  return (
    <div className="container">
      <h2>Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-title">Total Orders</div>
          <div className="analytics-value">{data.totalOrders}</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-title">Total Revenue</div>
          <div className="analytics-value">₹{data.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
}
