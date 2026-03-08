import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../api';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: 'Entrepreneur',
    company: '',
    profileVisibility: true,
    connectionRequests: true,
    searchVisibility: true,
    activityStatus: true,
    emailNotifications: true,
    connectionUpdates: true,
    messageAlerts: true,
    weeklyDigest: false,
    twoFactor: false,
    loginAlerts: true,
    marketingEmails: false,
    productUpdates: true,
    eventInvitations: true,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    api
      .get(`/settings/${userId}`)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === 'object') {
          setForm((f) => ({ ...f, ...data }));
        }
      })
      .catch((err) => {
        console.error('Failed to load settings', err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      await api.put(`/settings/${userId}`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  const toggle = (key: keyof typeof form, value: boolean) => {
    if (typeof form[key] === 'boolean') setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Customize your NEFRA experience. Manage your account, privacy, notifications, and security preferences.
        </p>

        <form onSubmit={handleSave} className="mt-10 space-y-12">
          {/* Account */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your personal information and account details</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your display name"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>Entrepreneur</option>
                  <option>Investor</option>
                  <option>Advisor</option>
                  <option>Founder</option>
                  <option>Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your current organization"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">Change your account password</p>
                <button type="button" className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">Manage</button>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Control who can see your profile and activity</p>
            <div className="mt-6 space-y-4">
              {([
                { key: 'profileVisibility', label: 'Profile Visibility', desc: 'Allow others to view your full profile' },
                { key: 'connectionRequests', label: 'Connection Requests', desc: 'Allow users to send you connection requests' },
                { key: 'searchVisibility', label: 'Search Visibility', desc: 'Appear in search results for other users' },
                { key: 'activityStatus', label: 'Activity Status', desc: 'Show when you are active on the platform' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form[key]}
                    onClick={() => toggle(key, !form[key])}
                    className={`h-6 w-11 rounded-full transition-colors ${form[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={'inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ' + (form[key] ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            <div className="mt-6 space-y-4">
              {([
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'connectionUpdates', label: 'Connection Updates', desc: 'Get notified when connections post or update' },
                { key: 'messageAlerts', label: 'Message Alerts', desc: 'Receive alerts for new messages' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a weekly summary of your network activity' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form[key]}
                    onClick={() => toggle(key, !form[key])}
                    className={`h-6 w-11 rounded-full transition-colors ${form[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={'inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ' + (form[key] ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            <div className="mt-6 space-y-4">
              {([
                { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new login attempts' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form[key]}
                    onClick={() => toggle(key, !form[key])}
                    className={`h-6 w-11 rounded-full transition-colors ${form[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={'inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ' + (form[key] ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>
              ))}
              <div className="pt-4">
                <p className="font-medium text-gray-900">Login History</p>
                <p className="text-sm text-gray-500">View recent login activity and devices</p>
                <button type="button" className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">Manage</button>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between gap-4">
            <button type="button" className="text-gray-600 hover:text-gray-900">Cancel</button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
            >
              <Save className="h-4 w-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
