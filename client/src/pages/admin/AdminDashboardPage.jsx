import { useEffect, useState } from "react";
import { FiActivity, FiBook, FiCalendar, FiCheckCircle, FiSend, FiShield, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../api/axios";
import { BarChartCard } from "../../components/charts/BarChartCard";
import { LineChartCard } from "../../components/charts/LineChartCard";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";
import { SectionHeader } from "../../components/common/SectionHeader";
import { Skeleton } from "../../components/common/Skeleton";
import { StatCard } from "../../components/feedback/StatCard";
import { AppShell } from "../../components/layout/AppShell";
import { formatDate } from "../../utils/formatters";

const initialCampForm = {
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  capacity: 50,
  status: "Upcoming"
};

export const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [cadets, setCadets] = useState([]);
  const [camps, setCamps] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campModal, setCampModal] = useState(false);
  const [campForm, setCampForm] = useState(initialCampForm);
  const [materialForm, setMaterialForm] = useState({ title: "", category: "", visibility: "All", file: null });
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, cadetsRes, campsRes, achievementsRes, materialsRes, attendanceRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/users/cadets?limit=8"),
        api.get("/camps?limit=8"),
        api.get("/achievements?limit=8"),
        api.get("/materials?limit=6"),
        api.get("/attendance?limit=8")
      ]);
      setDashboard(dashboardRes.data.data);
      setCadets(cadetsRes.data.data);
      setCamps(campsRes.data.data);
      setAchievements(achievementsRes.data.data);
      setMaterials(materialsRes.data.data);
      setAttendance(attendanceRes.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createCamp = async (event) => {
    event.preventDefault();
    try {
      await api.post("/camps", campForm);
      toast.success("Camp created successfully");
      setCampModal(false);
      setCampForm(initialCampForm);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const reviewCadet = async (id, status) => {
    try {
      await api.patch(`/users/cadets/${id}/review`, { status });
      toast.success(`Cadet ${status.toLowerCase()}`);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const reviewAchievement = async (id, status) => {
    try {
      await api.patch(`/achievements/${id}/review`, { status });
      toast.success(`Achievement ${status.toLowerCase()}`);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const uploadMaterial = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(materialForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await api.post("/materials", formData);
      toast.success("Study material uploaded");
      setMaterialForm({ title: "", category: "", visibility: "All", file: null });
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const sendAnnouncement = async (event) => {
    event.preventDefault();
    try {
      await api.post("/notifications", announcement);
      toast.success("Announcement broadcast");
      setAnnouncement({ title: "", message: "" });
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const markAttendance = async (cadetId) => {
    try {
      await api.post("/attendance", { cadet: cadetId, date: new Date().toISOString(), status: "Present" });
      toast.success("Attendance recorded");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const stats = dashboard?.stats || {};

  return (
    <AppShell>
      <section className="mb-6 rounded-[34px] bg-gradient-to-br from-slate-950 via-brand-900 to-military p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.32em] text-command">Officer Command Deck</p>
        <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">NCC operational command and performance platform.</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200">
          Review cadet onboarding, monitor participation, publish materials, approve achievements, and guide training
          performance from one responsive platform.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36" />)
          : [
              { icon: FiUsers, label: "Total Cadets", value: stats.totalCadets, accent: "from-brand-500 to-brand-300" },
              { icon: FiCheckCircle, label: "Attendance Rate", value: stats.attendanceRate, accent: "from-emerald-500 to-emerald-300" },
              { icon: FiCalendar, label: "Active Camps", value: stats.activeCamps, accent: "from-command to-amber-300" },
              { icon: FiActivity, label: "Pending Approvals", value: stats.pendingApprovals, accent: "from-rose-500 to-orange-300" }
            ].map((item) => <StatCard key={item.label} {...item} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {loading ? <Skeleton className="h-80" /> : <LineChartCard title="Attendance Analytics" data={dashboard?.charts?.attendanceSeries || []} dataKey="attendance" />}
        {loading ? <Skeleton className="h-80" /> : <BarChartCard title="Camp Participation" data={dashboard?.charts?.participationSeries || []} dataKey="approved" />}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-6" id="cadets">
          <SectionHeader
            eyebrow="Cadet Management"
            title="Registration queue and roster"
            description="Approve incoming cadets, manage the roster, and execute quick attendance actions."
            action={<Button onClick={() => setCampModal(true)}>Create Camp</Button>}
          />
          <div className="space-y-4">
            {cadets.length ? (
              cadets.map((cadet) => (
                <div key={cadet._id} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{cadet.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-300">
                        {cadet.cadetId} • {cadet.rank || "Unassigned"} • {cadet.wing || "Wing pending"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cadet.registrationStatus === "Pending" ? (
                        <>
                          <Button variant="secondary" onClick={() => reviewCadet(cadet._id, "Approved")}>
                            Approve
                          </Button>
                          <Button variant="subtle" onClick={() => reviewCadet(cadet._id, "Rejected")}>
                            Reject
                          </Button>
                        </>
                      ) : null}
                      <Button variant="subtle" onClick={() => markAttendance(cadet._id)}>
                        Mark Present
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={FiUsers} title="No cadets available" description="New cadet records will appear here." />
            )}
          </div>
        </Card>

        <Card className="space-y-6">
          <SectionHeader eyebrow="Broadcast" title="Announcements and alerts" description="Push command updates across the cadet ecosystem." />
          <form onSubmit={sendAnnouncement} className="space-y-3">
            <input
              placeholder="Announcement title"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              value={announcement.title}
              onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })}
              required
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              value={announcement.message}
              onChange={(event) => setAnnouncement({ ...announcement, message: event.target.value })}
              required
            />
            <Button className="w-full">
              <FiSend /> Broadcast Announcement
            </Button>
          </form>

          <div className="rounded-[24px] bg-slate-900/5 p-4 dark:bg-white/5">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Audit snapshot</h3>
            <div className="mt-4 space-y-3">
              {(dashboard?.auditLogs || []).map((log) => (
                <div key={log._id} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 p-3 dark:border-slate-700">
                  <FiShield className="mt-1 text-command" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      {log.actor?.name || "System"} • {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2" id="approvals">
        <Card>
          <SectionHeader eyebrow="Achievement Control" title="Pending achievement reviews" description="Approve certificates and maintain badge progression integrity." />
          <div className="space-y-4">
            {achievements.map((item) => (
              <div key={item._id} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      {item.cadet?.name || "Cadet"} • {item.approvalStatus}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => reviewAchievement(item._id, "Approved")}>
                      Approve
                    </Button>
                    <Button variant="subtle" onClick={() => reviewAchievement(item._id, "Rejected")}>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card id="materials">
          <SectionHeader eyebrow="Content Ops" title="Upload study materials" description="Distribute PDFs by category and visibility tier." />
          <form onSubmit={uploadMaterial} className="space-y-3">
            <input
              placeholder="Material title"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              value={materialForm.title}
              onChange={(event) => setMaterialForm({ ...materialForm, title: event.target.value })}
              required
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="Category"
                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
                value={materialForm.category}
                onChange={(event) => setMaterialForm({ ...materialForm, category: event.target.value })}
                required
              />
              <select
                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
                value={materialForm.visibility}
                onChange={(event) => setMaterialForm({ ...materialForm, visibility: event.target.value })}
              >
                <option value="All">All</option>
                <option value="CadetsOnly">Cadets Only</option>
                <option value="AdminsOnly">Admins Only</option>
              </select>
            </div>
            <input
              type="file"
              accept="application/pdf"
              className="w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 dark:border-slate-700"
              onChange={(event) => setMaterialForm({ ...materialForm, file: event.target.files[0] })}
              required
            />
            <Button className="w-full">
              <FiBook /> Upload Material
            </Button>
          </form>
          <div className="mt-5 space-y-3">
            {materials.map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-900/5 p-3 text-sm dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-slate-500 dark:text-slate-300">{item.category}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2" id="camps">
        <Card>
          <SectionHeader eyebrow="Camp Operations" title="Upcoming camps" description="Track participation pipeline and camp status." />
          <div className="space-y-4">
            {camps.map((camp) => (
              <div key={camp._id} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{camp.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      {camp.location} • {formatDate(camp.startDate)} to {formatDate(camp.endDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{camp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader eyebrow="Daily Attendance" title="Latest attendance records" description="Quick view into recent attendance operations." />
          <div className="space-y-4">
            {attendance.map((item) => (
              <div key={item._id} className="rounded-[24px] border border-slate-200/70 p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">{item.cadet?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {item.status} • {formatDate(item.date)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal isOpen={campModal} onClose={() => setCampModal(false)} title="Create New Camp">
        <form onSubmit={createCamp} className="grid gap-3 md:grid-cols-2">
          {["title", "location", "startDate", "endDate", "capacity", "status"].map((field) =>
            field === "status" ? (
              <select
                key={field}
                value={campForm.status}
                onChange={(event) => setCampForm({ ...campForm, status: event.target.value })}
                className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              >
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            ) : (
              <input
                key={field}
                type={field.includes("Date") ? "date" : field === "capacity" ? "number" : "text"}
                placeholder={field}
                className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 capitalize dark:border-slate-700"
                value={campForm[field]}
                onChange={(event) => setCampForm({ ...campForm, [field]: event.target.value })}
                required
              />
            )
          )}
          <textarea
            placeholder="Description"
            rows="4"
            className="md:col-span-2 rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
            value={campForm.description}
            onChange={(event) => setCampForm({ ...campForm, description: event.target.value })}
            required
          />
          <button className="md:col-span-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white">Save Camp</button>
        </form>
      </Modal>
    </AppShell>
  );
};
