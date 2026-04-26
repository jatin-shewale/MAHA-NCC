import { useEffect, useState } from "react";
import { FiAward, FiCalendar, FiDownload, FiFileText, FiTarget, FiTrendingUp, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../api/axios";
import { LineChartCard } from "../../components/charts/LineChartCard";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { QrScanner } from "../../components/common/QrScanner";
import { SectionHeader } from "../../components/common/SectionHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { StatCard } from "../../components/feedback/StatCard";
import { AppShell } from "../../components/layout/AppShell";
import { useAuth } from "../../context/AuthContext";
import { downloadBlob, formatDate } from "../../utils/formatters";

export const CadetDashboardPage = () => {
  const { user, updateStoredUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [camps, setCamps] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendanceQr, setAttendanceQr] = useState(null);
  const [achievementForm, setAchievementForm] = useState({ title: "", description: "", certificate: null });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    rank: user?.rank || "",
    wing: user?.wing || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, campsRes, materialsRes, timelineRes, notificationsRes, qrRes] = await Promise.all([
        api.get("/users/dashboard"),
        api.get("/camps?limit=6"),
        api.get("/materials?limit=8"),
        api.get("/users/timeline"),
        api.get("/notifications?limit=6"),
        api.get("/attendance/qr")
      ]);
      setDashboard(dashboardRes.data.data);
      setCamps(campsRes.data.data);
      setMaterials(materialsRes.data.data);
      setTimeline(timelineRes.data.data);
      setNotifications(notificationsRes.data.data);
      setAttendanceQr(qrRes.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyToCamp = async (campId) => {
    try {
      await api.post(`/camps/${campId}/apply`);
      toast.success("Camp application submitted");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const uploadAchievement = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(achievementForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await api.post("/achievements", formData);
      toast.success("Achievement submitted");
      setAchievementForm({ title: "", description: "", certificate: null });
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(profileForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const { data } = await api.put("/users/profile", formData);
      updateStoredUser(data.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const exportPdf = async () => {
    try {
      const response = await api.get("/users/performance-report", { responseType: "blob" });
      downloadBlob(response.data, `${user.cadetId}-performance-report.pdf`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleMaterialDownload = (item) => {
    window.open(`${import.meta.env.VITE_FILE_BASE_URL || "http://localhost:5000"}${item.fileUrl}`, "_blank");
  };

  const attendanceSeries =
    dashboard?.recentAttendance?.map((item, index) => ({
      name: `${index + 1}`,
      attendance: item.status === "Present" ? 100 : 35
    })) || [];

  return (
    <AppShell>
      <section className="mb-6 rounded-[34px] bg-gradient-to-br from-brand-600 via-brand-800 to-ink p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.32em] text-command">Cadet Mission Deck</p>
        <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Your cadet performance platform.</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200">
          Track progress, apply to camps, manage achievements, access study resources, and stay aligned with command
          updates in one premium platform.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36" />)
          : [
              { icon: FiTrendingUp, label: "Attendance Rate", value: dashboard?.attendanceRate, accent: "from-emerald-500 to-emerald-300" },
              { icon: FiAward, label: "Approved Achievements", value: dashboard?.approvedAchievements, accent: "from-command to-amber-300" },
              { icon: FiCalendar, label: "Camp Applications", value: dashboard?.campApplications, accent: "from-brand-500 to-brand-300" },
              { icon: FiTarget, label: "Achievement Streak", value: user?.achievementStreak, accent: "from-rose-500 to-orange-300" }
            ].map((item) => <StatCard key={item.label} {...item} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <LineChartCard title="Attendance Trend" data={attendanceSeries} dataKey="attendance" />
        <Card>
          <SectionHeader
            eyebrow="AI Training Recommendations"
            title="Recommended next actions"
            description="Adaptive recommendations based on your attendance, achievements, and camp activity."
          />
          <div className="space-y-3">
            {(dashboard?.recommendations || []).map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{item.priority}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{item.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card id="camps">
          <SectionHeader
            eyebrow="Camp Opportunities"
            title="Apply for upcoming camps"
            description="Join camps to improve leadership exposure and performance score."
          />
          <div className="space-y-4">
            {camps.length ? (
              camps.map((camp) => (
                <div key={camp._id} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{camp.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-300">
                        {camp.location} • {formatDate(camp.startDate)} to {formatDate(camp.endDate)}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => applyToCamp(camp._id)}>
                      Apply
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={FiCalendar} title="No camps listed" description="New camp opportunities will appear here." />
            )}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Digital Attendance" title="QR attendance pass" description="Present this code to the officer for rapid attendance capture." />
          {attendanceQr ? (
            <div className="space-y-4">
              <div className="flex justify-center rounded-[28px] bg-white p-5">
                <img src={attendanceQr.qrImage} alt="Attendance QR" className="h-56 w-56" />
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-300">Token: {attendanceQr.qrToken}</p>
            </div>
          ) : (
            <Skeleton className="h-72" />
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card id="achievements">
          <SectionHeader
            eyebrow="Achievement Uploads"
            title="Submit certificates"
            description="Upload verified achievements for officer approval and badge progression."
          />
          <form onSubmit={uploadAchievement} className="space-y-3">
            <input
              placeholder="Achievement title"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              value={achievementForm.title}
              onChange={(event) => setAchievementForm({ ...achievementForm, title: event.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              rows="3"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              value={achievementForm.description}
              onChange={(event) => setAchievementForm({ ...achievementForm, description: event.target.value })}
            />
            <input
              type="file"
              className="w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 dark:border-slate-700"
              onChange={(event) => setAchievementForm({ ...achievementForm, certificate: event.target.files[0] })}
              required
            />
            <Button className="w-full">
              <FiAward /> Submit Achievement
            </Button>
          </form>
          <div className="mt-5 space-y-3">
            {(dashboard?.recentAchievements || []).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-900/5 p-3 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.approvalStatus}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card id="materials">
          <SectionHeader
            eyebrow="Study Library"
            title="Download study materials"
            description="Access command-approved PDFs and knowledge packs."
            action={
              <Button onClick={exportPdf}>
                <FiFileText /> Export Report
              </Button>
            }
          />
          <div className="space-y-3">
            {materials.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{item.category}</p>
                </div>
                <Button variant="secondary" onClick={() => handleMaterialDownload(item)}>
                  <FiDownload /> Open
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionHeader eyebrow="Performance" title="Leaderboard and badges" description="See how your performance compares with the top cadets." />
          <div className="space-y-4">
            {(dashboard?.leaderboard || []).map((item, index) => (
              <div key={item._id} className="flex items-center justify-between rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    #{index + 1} {item.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {item.badgeLevel} • {item.cadetId}
                  </p>
                </div>
                <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-500">{item.badgeScore}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Notice Board" title="Notifications and timeline" description="Follow current announcements and your recent activity trail." />
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-900/5 p-3 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {timeline.map((item, index) => (
              <div key={`${item.type}-${index}`} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <p className="font-semibold capitalize text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {item.type} • {formatDate(item.date)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]" id="profile">
        <Card>
          <SectionHeader eyebrow="Profile" title="Update personal details" description="Keep rank, wing, and communication details current." />
          <form onSubmit={updateProfile} className="grid gap-3 md:grid-cols-2">
            {Object.entries(profileForm)
              .filter(([key]) => key !== "profileImage")
              .map(([key, value]) => (
                <input
                  key={key}
                  placeholder={key}
                  className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 capitalize dark:border-slate-700"
                  value={value}
                  onChange={(event) => setProfileForm({ ...profileForm, [key]: event.target.value })}
                />
              ))}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="md:col-span-2 rounded-2xl border border-dashed border-slate-200 px-4 py-3 dark:border-slate-700"
              onChange={(event) => setProfileForm({ ...profileForm, profileImage: event.target.files[0] })}
            />
            <button className="md:col-span-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white">Save Profile</button>
          </form>
        </Card>

        <Card>
          <SectionHeader eyebrow="Field Utility" title="Local scanner preview" description="A built-in scanner panel for future officer-side QR workflows and device testing." />
          <QrScanner onDetect={setScanResult} />
          <div className="mt-5 rounded-[24px] border border-slate-200/70 p-5 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-300">Last scanned token: {scanResult || "No token detected yet."}</p>
            <FiUser className="mt-4 text-3xl text-command" />
            <p className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {user?.cadetId} • {user?.rank} • {user?.wing}
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};
