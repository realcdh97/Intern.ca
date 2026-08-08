// This file is customized to run auth and user profiles entirely locally in localStorage
// to bypass any live Supabase cloud dependencies.

const getStorageItem = (key: string, defaultVal: any) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStorageItem = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const authListeners = new Set<(event: string, session: any) => void>();

export const supabase = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      const users = getStorageItem("mock_users", []);
      if (users.some((u: any) => u.email === email)) {
        return { data: { user: null }, error: { message: "User already exists" } };
      }
      const newUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 11),
        email,
        user_metadata: { full_name: options?.data?.full_name || "" }
      };
      users.push({ ...newUser, password });
      setStorageItem("mock_users", users);

      // Create default empty profile
      const profiles = getStorageItem("mock_profiles", []);
      profiles.push({
        user_id: newUser.id,
        full_name: options?.data?.full_name || "",
        bio: "",
        avatar_url: ""
      });
      setStorageItem("mock_profiles", profiles);

      // Automatically sign in
      const session = { user: newUser, access_token: "mock-token" };
      setStorageItem("mock_session", session);
      authListeners.forEach(cb => cb("SIGNED_IN", session));

      return { data: { user: newUser }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const users = getStorageItem("mock_users", []);
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        return { data: { user: null, session: null }, error: { message: "Invalid email or password" } };
      }
      const sessionUser = {
        id: user.id,
        email: user.email,
        user_metadata: { full_name: user.user_metadata?.full_name || "" }
      };
      const session = { user: sessionUser, access_token: "mock-token" };
      setStorageItem("mock_session", session);
      authListeners.forEach(cb => cb("SIGNED_IN", session));
      return { data: { user: sessionUser, session }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem("mock_session");
      authListeners.forEach(cb => cb("SIGNED_OUT", null));
      return { error: null };
    },
    getSession: async () => {
      const session = getStorageItem("mock_session", null);
      return { data: { session }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      authListeners.add(callback);
      const session = getStorageItem("mock_session", null);
      callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);
      
      (window as any).__auth_listener = (event: string, session: any) => {
        authListeners.forEach(cb => cb(event, session));
      };

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            }
          }
        }
      };
    }
  },
  from: (table: string) => {
    return {
      select: (fields: string = "*") => {
        return {
          eq: (field: string, value: any) => {
            return {
              maybeSingle: async () => {
                const data = getStorageItem(`mock_${table}`, []);
                const matches = data.filter((x: any) => x[field] === value);
                const item = matches.length > 0 ? matches[matches.length - 1] : null;
                return { data: item, error: null };
              },
              single: async () => {
                const data = getStorageItem(`mock_${table}`, []);
                const matches = data.filter((x: any) => x[field] === value);
                const item = matches.length > 0 ? matches[matches.length - 1] : null;
                if (!item) return { data: null, error: { message: "Not found" } };
                return { data: item, error: null };
              }
            };
          }
        };
      },
      insert: async (data: any) => {
        let tableData = getStorageItem(`mock_${table}`, []);
        const toInsert = Array.isArray(data) ? data : [data];
        for (const item of toInsert) {
          if (item.user_id) {
            tableData = tableData.filter((x: any) => x.user_id !== item.user_id);
          } else if (item.id) {
            tableData = tableData.filter((x: any) => x.id !== item.id);
          }
          tableData.push(item);
        }
        setStorageItem(`mock_${table}`, tableData);
        return { data, error: null };
      },
      update: (payload: any) => {
        return {
          eq: async (field: string, value: any) => {
            const tableData = getStorageItem(`mock_${table}`, []);
            let found = false;
            const updated = tableData.map((item: any) => {
              if (item[field] === value) {
                found = true;
                return { ...item, ...payload };
              }
              return item;
            });
            if (!found) {
              updated.push({ [field]: value, ...payload });
            }
            setStorageItem(`mock_${table}`, updated);
            return { data: payload, error: null };
          }
        };
      },
      upsert: async (data: any) => {
        const tableData = getStorageItem(`mock_${table}`, []);
        const idField = data.user_id ? "user_id" : "id";
        const val = data[idField];
        const index = tableData.findIndex((x: any) => x[idField] === val);
        if (index > -1) {
          tableData[index] = { ...tableData[index], ...data };
        } else {
          tableData.push(data);
        }
        setStorageItem(`mock_${table}`, tableData);
        return { data, error: null };
      }
    };
  }
} as any;