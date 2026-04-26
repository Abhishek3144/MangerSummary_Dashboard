import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const SEVERITY_CONFIG = {
  High: {
    color: "#FF5C5C",
    bg: "rgba(255, 92, 92, 0.08)",
    border: "rgba(255, 92, 92, 0.3)",
    dot: "#FF5C5C",
    label: "High",
  },
  Medium: {
    color: "#F5A623",
    bg: "rgba(245, 166, 35, 0.08)",
    border: "rgba(245, 166, 35, 0.3)",
    dot: "#F5A623",
    label: "Med",
  },
  Low: {
    color: "#4ADE80",
    bg: "rgba(74, 222, 128, 0.08)",
    border: "rgba(74, 222, 128, 0.3)",
    dot: "#4ADE80",
    label: "Low",
  },
};

const TYPE_ICONS = {
  Performance: "◈",
  Risk: "⬡",
  Opportunity: "◆",
  Default: "◉",
};

function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Low;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: "4px",
      padding: "3px 8px",
    }}>
      <span style={{
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: cfg.color,
        boxShadow: `0 0 6px ${cfg.color}`,
        display: "inline-block",
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
}

function InsightCard({ insight, index }) {
  const [hovered, setHovered] = useState(false);
  const cfg = SEVERITY_CONFIG[insight.severity] || SEVERITY_CONFIG.Low;
  const icon = TYPE_ICONS[insight.type] || TYPE_ICONS.Default;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "16px 18px",
        borderRadius: "10px",
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? cfg.border : "rgba(255,255,255,0.07)"}`,
        borderLeft: `3px solid ${cfg.color}`,
        transition: "all 0.22s ease",
        cursor: "default",
        animation: `fadeSlideIn 0.35s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
        gap: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize: "13px",
            color: cfg.color,
            lineHeight: 1,
          }}>
            {icon}
          </span>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.02em",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {insight.type}
          </span>
        </div>
        <SeverityBadge severity={insight.severity} />
      </div>

      <p style={{
        margin: "0 0 8px 0",
        fontSize: "13px",
        color: "rgba(255,255,255,0.6)",
        lineHeight: "1.6",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {insight.message}
      </p>

      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        padding: "8px 10px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ fontSize: "11px", color: cfg.color, flexShrink: 0, marginTop: "1px" }}>→</span>
        <span style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: "1.5",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {insight.suggestion}
        </span>
      </div>
    </div>
  );
}

function TeamCard({ team, teamIndex, isUpdated }) {
  // FIX 1: Always derive insights safely from team prop
  const insights = team.insights || [];

  const severityCounts = insights.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {});

  const highestSeverity = insights.some(i => i.severity === "High")
    ? "High"
    : insights.some(i => i.severity === "Medium")
    ? "Medium"
    : "Low";

  const accent = SEVERITY_CONFIG[highestSeverity].color;

  return (
    <div style={{
      background: isUpdated
        ? "rgba(74, 222, 128, 0.08)"
        : "rgba(255,255,255,0.025)",
      border: isUpdated
        ? "1px solid #4ADE80"
        : "1px solid rgba(255,255,255,0.08)",
      boxShadow: isUpdated
        ? "0 0 12px rgba(74, 222, 128, 0.4)"
        : "none",
      borderRadius: "14px",
      padding: "22px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: `cardReveal 0.4s ease ${teamIndex * 0.1}s both`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "700",
            color: accent,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {team.team.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.01em",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {team.team}
            </h2>
            <p style={{
              margin: 0,
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {insights.length} insight{insights.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {Object.entries(severityCounts).map(([sev, count]) => (
            <div key={sev} style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 7px",
              borderRadius: "4px",
              background: `${SEVERITY_CONFIG[sev]?.color}12`,
            }}>
              <span style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: SEVERITY_CONFIG[sev]?.color,
                display: "inline-block",
              }} />
              <span style={{
                fontSize: "11px",
                fontWeight: "600",
                color: SEVERITY_CONFIG[sev]?.color,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      padding: "10px 20px",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <span style={{
        fontSize: "20px",
        fontWeight: "700",
        color: color || "rgba(255,255,255,0.9)",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: "11px",
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'DM Sans', sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {label}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
      gap: "12px",
    }}>
      <div style={{
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
      }}>
        ◈
      </div>
      <p style={{
        margin: 0,
        fontSize: "14px",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        No insights available
      </p>
    </div>
  );
}

export default function Insights() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [updatedTeam, setUpdatedTeam] = useState(null);

  const getCols = () => {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };
  const [cols, setCols] = useState(getCols());

  useEffect(() => {
    const handleResize = () => setCols(getCols());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/insights`);
        const d = await res.json();
        setData(d);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchInitialData();

    socket.on("insightsUpdated", (newData) => {
      console.log("🔥 Live update received", newData);
      if (Array.isArray(newData) && newData.length > 0) {
        setData(newData);
        setUpdatedTeam(newData[newData.length - 1]?.team);
        setTimeout(() => setUpdatedTeam(null), 7000);
      } else {
        console.warn("Skipping empty/invalid update");
      }
    });

    return () => socket.disconnect();
  }, []);

  const allInsights = data.flatMap(t => t.insights || []);
  const highCount = allInsights.filter(i => i.severity === "High").length;
  const medCount = allInsights.filter(i => i.severity === "Medium").length;
  const lowCount = allInsights.filter(i => i.severity === "Low").length;

  // FIX 2: filteredData now correctly uses team.insights (not bare `insights`)
  const filteredData = filter === "All"
    ? data
    : data
        .map(team => ({
          ...team,
          insights: (team.insights || []).filter(i => i.severity === filter),
        }))
        .filter(team => team.insights.length > 0);

  const filters = ["All", "High", "Medium", "Low"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }

        .filter-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.18s ease;
        }
        .filter-btn:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
        }
        .filter-btn.active {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.9);
        }
        .filter-btn.active-High {
          background: rgba(255, 92, 92, 0.12);
          border-color: rgba(255, 92, 92, 0.35);
          color: #FF5C5C;
        }
        .filter-btn.active-Medium {
          background: rgba(245, 166, 35, 0.12);
          border-color: rgba(245, 166, 35, 0.35);
          color: #F5A623;
        }
        .filter-btn.active-Low {
          background: rgba(74, 222, 128, 0.12);
          border-color: rgba(74, 222, 128, 0.35);
          color: #4ADE80;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0C0C0F",
        padding: "40px 32px",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto 32px",
          animation: "fadeSlideIn 0.4s ease both",
        }}>
          <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}>
              Analytics
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>·</span>
            <span style={{
              fontSize: "10px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.04em",
            }}>
              Manager View
            </span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "20px",
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
                Team Insights
              </h1>
              <p style={{
                margin: "6px 0 0",
                fontSize: "14px",
                color: "rgba(255,255,255,0.35)",
              }}>
                Surface-level summary across all active teams
              </p>
            </div>

            {!loading && data.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <StatPill label="Total" value={allInsights.length} />
                <StatPill label="High" value={highCount} color="#FF5C5C" />
                <StatPill label="Medium" value={medCount} color="#F5A623" />
                <StatPill label="Low" value={lowCount} color="#4ADE80" />
              </div>
            )}
          </div>

          <div style={{
            height: "1px",
            background: "linear-gradient(to right, rgba(255,255,255,0.08), transparent)",
            marginTop: "24px",
          }} />
        </div>

        {/* Filter bar */}
        {!loading && data.length > 0 && (
          <div style={{
            maxWidth: "1100px",
            margin: "0 auto 24px",
            display: "flex",
            gap: "6px",
            animation: "fadeSlideIn 0.4s ease 0.1s both",
          }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn${filter === f ? (f === "All" ? " active" : ` active active-${f}`) : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {loading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "16px",
            }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  height: "280px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animation: "shimmer 1.5s ease infinite",
                }} />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "16px",
            }}>
              {filteredData.map((team, index) => (
                <TeamCard
                  key={index}
                  team={team}
                  teamIndex={index}
                  isUpdated={team.team === updatedTeam}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          maxWidth: "1100px",
          margin: "40px auto 0",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.04em",
          }}>
            Insightix · Manager Analytics
          </span>
          <span style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.18)",
          }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </>
  );
}
