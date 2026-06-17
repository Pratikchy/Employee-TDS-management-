/**
 * TDS Portal Global Scripts
 */
// 🔐 Password Hashing Function
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


const TDS_PORTAL = {
    // Session Management
    session: {
        getUser: () => JSON.parse(localStorage.getItem("loggedInUser")),
        logout: () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        },
        checkAuth: (role) => {
            const user = TDS_PORTAL.session.getUser();
            if (!user || (role && user.role !== role)) {
                window.location.href = "index.html";
                return null;
            }
            return user;
        },
        toggleProfileDropdown: () => {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.classList.toggle('hidden');
                dropdown.classList.toggle('animate-fade-in');
            }
        }
    },

    // UI Utilities
    ui: {
        toggleTheme: () => {
            const html = document.documentElement;
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        },
        showToast: (message, type = 'error') => {
            // Remove existing toast if any
            const existingToast = document.getElementById('globalToast');
            if (existingToast) existingToast.remove();

            const toast = document.createElement('div');
            toast.id = 'globalToast';
            toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 z-[100] transition-all duration-300 transform translate-y-0 glass animate-fade-in`;
            
            const colors = {
                success: 'border-emerald-500/50 text-emerald-400',
                error: 'border-red-500/50 text-red-400',
                info: 'border-blue-500/50 text-blue-400'
            };
            
            const icons = {
                success: 'check-circle',
                error: 'alert-circle',
                info: 'info'
            };

            toast.classList.add(...colors[type].split(' '));
            toast.innerHTML = `
                <i data-lucide="${icons[type]}" class="w-5 h-5"></i>
                <span class="font-medium">${message}</span>
            `;

            document.body.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-4');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },
        initCommon: () => {
            // Close dropdowns on click outside
            window.addEventListener('click', (e) => {
                const profileBtn = document.getElementById('profileBtn');
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown && !dropdown.classList.contains('hidden') && profileBtn && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });
            lucide.createIcons();
        },
        showMyProfile: async () => {
            const sessionUser = TDS_PORTAL.session.getUser();
            if (!sessionUser) return;

            // Close dropdown
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) dropdown.classList.add('hidden');

            // Fetch latest user data from DB
            let user = sessionUser;
            try {
                const users = await TDS_PORTAL.db.getUsers();
                const found = users.find(u => u.id === sessionUser.id);
                if (found) user = found;
            } catch(e) {}

            const modal = document.createElement('div');
            modal.id = 'myProfileModal';
            modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in';
            modal.innerHTML = `
                <div class="glass max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-slide-up">
                    <div class="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <button onclick="document.getElementById('myProfileModal').remove()" class="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-xl transition-colors text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="px-8 pb-8 relative">
                        <div class="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center text-3xl font-bold text-slate-700 dark:text-slate-300 -mt-12 mb-4">
                            ${user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        
                        <div class="mb-6">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white" id="displayProfileName">${user.name}</h3>
                            <p class="text-slate-500 dark:text-slate-400 font-medium">${user.email}</p>
                            <span class="inline-flex items-center px-3 py-1 mt-3 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                                ${user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                  user.role === 'HR' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}">
                                ${user.role} role
                            </span>
                        </div>

                        <form id="updateProfileForm" class="space-y-4">
                            <div>
                                <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Display Name</label>
                                <div class="relative">
                                    <i data-lucide="edit-2" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                    <input type="text" name="name" value="${user.name}" required class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                                </div>
                            </div>
                            
                            <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                                <i data-lucide="save" class="w-4 h-4 mr-2"></i> Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            lucide.createIcons();

            document.getElementById('updateProfileForm').onsubmit = async (e) => {
                e.preventDefault();
                const newName = e.target.name.value.trim();
                const btn = e.target.querySelector('button');
                btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mr-2 animate-spin"></i> Saving...';
                
                try {
                    const res = await fetch(`/api/users/${user.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: newName })
                    });
                    if (res.ok) {
                        TDS_PORTAL.ui.showToast("Profile name updated successfully", "success");
                        document.getElementById('displayProfileName').innerText = newName;
                        
                        // Update session
                        sessionUser.name = newName;
                        localStorage.setItem('loggedInUser', JSON.stringify(sessionUser));
                        
                        // Update UI seamlessly
                        const nameElems = document.querySelectorAll('#userName');
                        nameElems.forEach(el => el.innerText = newName);

                        setTimeout(() => modal.remove(), 1000);
                    } else {
                        throw new Error();
                    }
                } catch (error) {
                    TDS_PORTAL.ui.showToast("Failed to update profile", "error");
                }
                btn.innerHTML = '<i data-lucide="save" class="w-4 h-4 mr-2"></i> Update Profile';
                lucide.createIcons();
            };

            // Close modal on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        }
    },

    // Data Management
    db: {
        getUsers: async () => {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");
                return await res.json();
            } catch (error) {
                console.error("Error fetching users:", error);
                throw error;
            }
        },
        getStats: async () => {
            try {
                const res = await fetch("/api/stats");
                if (!res.ok) throw new Error("Failed to fetch stats");
                return await res.json();
            } catch (error) {
                 console.error("Error fetching stats:", error);
                 throw error;
            }
        },
        deleteUser: async (userId) => {
            if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                try {
                    const res = await fetch(`/api/users/${userId}`, {
                        method: "DELETE"
                    });
                    
                    if (res.ok) {
                        TDS_PORTAL.ui.showToast("User deleted successfully", "success");
                        // Refresh dashboard if functions exist
                        if (typeof initAdminDashboard === 'function') initAdminDashboard();
                        if (typeof initHRDashboard === 'function') initHRDashboard();
                    } else {
                        throw new Error("Failed to delete user");
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    TDS_PORTAL.ui.showToast("Failed to delete user", "error");
                }
            }
        },
        updateUser: async (updatedUser) => {
            try {
                const res = await fetch(`/api/users/${updatedUser.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedUser)
                });
                
                if (res.ok) {
                    TDS_PORTAL.ui.showToast("User updated successfully", "success");
                    if (typeof initAdminDashboard === 'function') initAdminDashboard();
                    if (typeof initHRDashboard === 'function') initHRDashboard();
                    return true;
                } else {
                    throw new Error("Failed to update user");
                }
            } catch (error) {
                console.error("Error updating user:", error);
                TDS_PORTAL.ui.showToast("Failed to update user", "error");
                return false;
            }
        },
        editUser: async (userId) => {
            const users = await TDS_PORTAL.db.getUsers();
            const user = users.find(u => u.id === userId);
            if (!user) return;

            // Create Modal
            const modal = document.createElement('div');
            modal.id = 'editModal';
            modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in';
            modal.innerHTML = `
                <div class="glass max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-slide-up">
                    <div class="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 class="text-2xl font-bold text-white">Edit User</h3>
                        <button onclick="document.getElementById('editModal').remove()" class="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <form id="editUserForm" class="p-8 space-y-6">
                        <input type="hidden" name="id" value="${user.id}">
                        <div>
                            <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Full Name</label>
                            <input type="text" name="name" value="${user.name}" required class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Email Address</label>
                            <input type="email" name="email" value="${user.email}" required class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Role</label>
                            <select name="role" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                                <option value="EMPLOYEE" ${user.role === 'EMPLOYEE' ? 'selected' : ''}>Employee</option>
                                <option value="HR" ${user.role === 'HR' ? 'selected' : ''}>HR Manager</option>
                                <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Administrator</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">New Password (Leave blank to keep current)</label>
                            <div class="relative">
                                <i data-lucide="key" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                <input type="password" name="password" placeholder="••••••••" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                            </div>
                        </div>
                        <div class="flex justify-end space-x-4 pt-4">
                            <button type="button" onclick="document.getElementById('editModal').remove()" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary px-8 py-3">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            lucide.createIcons();

            document.getElementById('editUserForm').onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedUser = {
                    id: formData.get('id'),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role')
                };

                const password = formData.get('password');
                if (password && password.trim().length > 0) {
                    if (password.length < 6) {
                        TDS_PORTAL.ui.showToast('Password must be at least 6 characters.', 'error');
                        return;
                    }
                    updatedUser.password = password;
                }
                const success = await TDS_PORTAL.db.updateUser(updatedUser);
                if (success) {
                    modal.remove();
                }
            };
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        },
        viewUser: async (userId) => {
            const users = await TDS_PORTAL.db.getUsers();
            const user = users.find(u => u.id === userId);
            if (!user) return;

            // Create Modal
            const modal = document.createElement('div');
            modal.id = 'userModal';
            modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in';
            modal.innerHTML = `
                <div class="glass max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-slide-up">
                    <div class="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 class="text-2xl font-bold text-white">User Details</h3>
                        <button onclick="document.getElementById('userModal').remove()" class="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <div class="p-8 space-y-6">
                        <div class="flex items-center space-x-6">
                            <div class="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl font-bold text-blue-400 border border-blue-500/20">
                                ${user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h4 class="text-xl font-bold text-white">${user.name}</h4>
                                <span class="inline-flex items-center px-3 py-1 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                                    ${user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                      user.role === 'HR' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}">
                                    ${user.role}
                                </span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Email Address</p>
                                <p class="text-slate-300 mt-1">${user.email}</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Created By</p>
                                <p class="text-slate-300 mt-1">${user.createdBy || 'System'}</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Account ID</p>
                                <p class="text-slate-300 mt-1">#${user.id.slice(0, 8)}</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status</p>
                                <p class="text-emerald-400 mt-1 font-bold">ACTIVE</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-8 bg-slate-900/50 border-t border-slate-800 flex justify-end">
                        <button onclick="document.getElementById('userModal').remove()" class="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
                            Close
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            lucide.createIcons();
            
            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        }
    }
};

// Initialize common UI elements
document.addEventListener('DOMContentLoaded', () => {
    TDS_PORTAL.ui.initCommon();
});

// Common functions for legacy compatibility
function logout() { TDS_PORTAL.session.logout(); }
function goBack() { window.history.back(); }

// Init Theme automatically on load
(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

// Handle browser Back/Forward (bfcache) navigation auth checks
window.addEventListener('pageshow', (event) => {
    const currentPath = window.location.pathname;
    
    // Always clear session completely if the user reaches the login page
    if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath === '') {
        localStorage.removeItem('loggedInUser');
    } 
    // Otherwise, for any dashboard or secure page, aggressively verify session
    else if (currentPath.includes('-dashboard') || currentPath.includes('dashboard.html') || currentPath.includes('payroll.html')) {
        const user = TDS_PORTAL.session.getUser();
        // Even if not event.persisted, we must ensure a valid session exists
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});
