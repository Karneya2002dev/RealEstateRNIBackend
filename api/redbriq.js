import axios from "axios";

async function redbriqLogin(user, pass) {
const url = `${BASE}/auth/login`;
try {
const res = await axios.post(url, { user, pass }, { validateStatus: () => true });

if (res.status === 200) {
cookieStore = res.headers["set-cookie"]?.[0];
return { ok: true, status: res.status };
}

return { ok: false, status: res.status, data: res.data };
} catch (err) {
console.error("[redbriq] login error", err?.message || err);
return { ok: false, error: err };
}
}


async function getProjects(devId) {
const url = `${BASE}/developers/${devId}/dashboard/projects`;


// If no cookie, login first
if (!cookieStore) {
console.log("[redbriq] no cookie store found. logging in...");
const l = await redbriqLogin(process.env.REDBRIQ_USER, process.env.REDBRIQ_PASS);
if (!l.ok) throw new Error("Login failed");
}


try {
const res = await axios.get(url, {
headers: {
Accept: "application/json, text/plain, */*",
Cookie: cookieStore
},
validateStatus: () => true
});


// If unauthorized, try re-login once
if (res.status === 401 || res.status === 403) {
console.log("[redbriq] unauthorized — re-logging in and retrying...");
const l = await redbriqLogin(process.env.REDBRIQ_USER, process.env.REDBRIQ_PASS);
if (!l.ok) throw new Error("Re-login failed");


const retry = await axios.get(url, {
headers: { Accept: "application/json, text/plain, */*", Cookie: cookieStore },
validateStatus: () => true
});
return retry;
}


return res;
} catch (err) {
console.error("[redbriq] getProjects error", err?.message || err);
throw err;
}
}


export default { redbriqLogin, getProjects };