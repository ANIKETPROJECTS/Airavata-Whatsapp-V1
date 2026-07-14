import { useState } from 'react';
import { User, LogOut, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully');
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500">Update your personal information and preferences</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                  <User className="w-10 h-10 text-gray-400" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 text-red-600 font-medium text-sm border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" defaultValue="admin@acme.com" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary bg-white">
                  <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" placeholder="Leave blank to keep current" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
