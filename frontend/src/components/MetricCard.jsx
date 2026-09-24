import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="white-card metric-card">
      <div
        className="metric-icon-box"
        style={{
          backgroundColor: iconBg || '#EFF6FF',
          color: iconColor || '#2563EB'
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="metric-label">{title}</div>
        <div className="metric-value">{value}</div>
        {subtext && <div className="metric-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
