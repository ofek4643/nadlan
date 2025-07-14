import React, { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styles from "./AdminDashboard.module.css";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, trend }) => (
  <div className={styles.statCard}>
    <span className={styles.statTitle}>{title}</span>
    <span className={styles.statValue}>
      {typeof value === "number" ? value.toLocaleString() : "—"}
    </span>{" "}
    <span className={styles.statTrend}>{trend}</span>
  </div>
);

const COLORS_MAP = {
  דירה: "#ffbb28",
  "דירת גן": "#07fa64ff",
  "בית פרטי": "#ff8042",
  פנטהאוז: "#8884d8",
  דופלקס: "#e70c0cff",
  מסחרי: "#0088FE",
  מגרש: "#e900feff",
};
export default function AdminDashboard() {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    messages: 0,
    visitors: 0,
    userGrowthDaily: [],
    propertyTypes: [],
    activities: [],
    quickUsers: [],
    trendUsers: null,
    trendProperties: null,
  });
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-stats",
          {
            withCredentials: true,
          }
        );
        setStats(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(
          "שגיאה בשליפת נתונים:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:5000/getAllUsers", {
          withCredentials: true,
        });
        setUsers(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const search = value.trim().toLowerCase();
    if (!search) {
      setFilteredUsers(users);
      return;
    }
    const result = users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(search)) ||
        (u.email && u.email.toLowerCase().includes(search))
    );
    setFilteredUsers(result);
  }, [value, users]);

  const renderPercentLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={navCollapsed ? styles.smallNavProfile : styles.navProfile}
      >
        <div className={styles.headerNav}>
          {navCollapsed ? "" : <h2>ניהול מערכת</h2>}
          <label className={styles.label}>
            <input
              onClick={() => setNavCollapsed((prev) => !prev)}
              className={styles.menu}
              type="checkbox"
            />
            ☰
          </label>
        </div>
        <hr />
        <nav>
          <ul className={styles.List}>
            <Link
              className={navCollapsed ? styles.smallListItem : styles.listItem}
              style={{ backgroundColor: "hsl(30, 100%, 60%)" }}
            >
              <span>📊</span>
              {navCollapsed ? "" : <span>לוח בקרה</span>}
            </Link>
            <Link
              to="/admin/users"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>👩‍👦</span>
              {navCollapsed ? "" : <span>ניהול משתמשים</span>}
            </Link>

            <Link
              to="/properties"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🏠︎</span>
              {navCollapsed ? "" : <span>נכסים</span>}
            </Link>
            <Link
              to="/my-profile"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>⚙</span>
              {navCollapsed ? "" : <span>הגדרות פרופיל</span>}
            </Link>
            <Link
              to="/mortgage-calculator"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <span>🗎</span>
              {navCollapsed ? "" : <span>מחשבון משכנתא</span>}
            </Link>
            <Link
              to="/"
              className={navCollapsed ? styles.smallListItem : styles.listItem}
            >
              <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i>
              {navCollapsed ? "" : <span>חזרה לאתר</span>}
            </Link>
          </ul>
        </nav>
      </div>

      <main className={styles.content}>
        <h2 className={styles.pageTitle}>לוח בקרה – מנהל מערכת</h2>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
            <span>טוען נתונים...</span>
          </div>
        ) : (
          <>
            <section className={styles.statGrid}>
              <StatCard
                title="משתמשים רשומים"
                value={stats.users}
                trend={
                  stats.trendUsers != null
                    ? `${
                        stats.trendUsers === 0
                          ? ""
                          : stats.trendUsers > 0
                          ? "+"
                          : "-"
                      }${stats.trendUsers.toFixed(1)}%`
                    : "—"
                }
              />

              {/* <StatCard
            title="ביקורים חודשיים"
            value={stats.visitors}
            trend="-3%"
          /> */}

              <StatCard
                title="מודעות נכסים"
                value={stats.properties}
                trend={
                  stats.trendProperties != null
                    ? `${
                        stats.trendProperties === 0
                          ? ""
                          : stats.trendProperties > 0
                          ? "+"
                          : "-"
                      }${stats.trendProperties.toFixed(1)}%`
                    : "—"
                }
              />
              {/* <StatCard title="הודעות פעילות" value={stats.messages} trend="+15%" /> */}
            </section>

            <section className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>התפלגות סוגי נכסים</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.propertyTypes}
                      dataKey="value"
                      nameKey="name"
                      label={renderPercentLabel}
                      outerRadius={100}
                      labelLine={false}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {stats.propertyTypes?.map((item) => (
                        <Cell
                          key={item.name}
                          fill={COLORS_MAP[item.name] || "#ccc"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.legend}>
                  {stats.propertyTypes?.map((item) => (
                    <div key={item.name} className={styles.legendItem}>
                      <span
                        className={styles.legendColorBox}
                        style={{
                          backgroundColor: COLORS_MAP[item.name] || "#ccc",
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>כמות משתמשים</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={stats.userGrowthDaily}>
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} tickMargin={15} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className={styles.bottomGrid}>
              <div className={styles.userMini}>
                <h3>ניהול משתמשים</h3>
                <CustomInput
                  type="text"
                  placeholder="חפש משתמשים..."
                  value={value}
                  className={styles.searchInput}
                  onChange={(e) => setValue(e.target.value)}
                />
                {filteredUsers.length === 0 ? (
                  <p className={styles.noResults}>לא נמצאו משתמשים</p>
                ) : (
                  filteredUsers.slice(0, 5).map((user) => (
                    <div className={styles.user} key={user._id}>
                      <div className={styles.flex}>
                        <div className={styles.firstLetter}>
                          {user.fullName?.charAt(0) || ""}
                        </div>
                        <div className={styles.info}>
                          <span>{user.fullName}</span>
                          <span>{user.email}</span>
                        </div>
                      </div>
                      <div className={styles.containerButton}></div>
                    </div>
                  ))
                )}
                <div className={styles.allUsersLink}>
                  <Link to="/admin/users">
                    <button className={styles.allUsersLinkBtn}>
                      נהל את כל המשתמשים
                    </button>
                  </Link>
                </div>
              </div>

              <div className={styles.activity}>
                <h3 className={styles.title}>📋 פעילויות אחרונות</h3>
                <ul className={styles.activityList}>
                  {stats.activities?.map((a, i) => (
                    <li key={i} className={styles.activityItem}>
                      <div className={styles.activityContent}>
                        <span className={styles.activityText}>{a.text}</span>
                        <span className={styles.activityDate}>
                          {new Date(a.date).toLocaleDateString("he-IL", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
