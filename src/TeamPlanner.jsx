import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { supabase } from "./supabaseClient.js";

const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAOj0lEQVR42u1de2wV15n/fWdm7tyHry9gHobY4AZCsgQQhJcDNKFVSNtUTTapwooNu6Fiy2qjhu0/VZRVV4YVu6oqraqkSUW62awWBamxCbQb7aLdJAXnUULSslAgGxxexuDaCY4f9zlz55xv/5iZaxswz/sw7nzS2NaVrn39+33ne59zCCPI448/rjU3Nysi4iEvVwGIACAEcrEoAGkAWf8FZhabN2/Gli1b1Ehv0i/3IjNrRCSJCBs3brxv9erVj9TXT1+WSFTXm6YZBSggYIgQAUopzuVyyd7e3tNnzpx5r6WlZTcRHQKA5uZmbc2aNfKafhczCwDYsGHDqtbW1nd6e/s4kOuX8+fP8549e3bff//9c32lvmbwt/3851s6Ozv93yWZOS+ldBzHUVLK4Bn5kVJKh5nzzKyYmU+cOJHeunXrXwHA3r179SuBrwHA9u3b/8UHXkrpKKUCdb4BUUqxlDLPzJxKpfgnP3numRFXgv/i8y+8sMV7vy2lDJAvgjiOo5g5n0wm+dlnn/1z3ycUwG9ubtaEEHjyySdXfPbZ5+yZmwD8YpIgpWRm2db26cCiRYumMzM1NTWJQqgEgN5++9f7PbvjBJCVRPLMzK+99torQ62OICL1nY0bVyxbtrQRgCIiLQgsS5AkKKUB4MbGxrWLFy+uF0LIpqYmIQDgodUPronFYuwREKBVAhFCEAA5ffr08Lp16x5hZqxatUoIANTQMONeZiYppQigKrnwnDlz7geAVatWsQCQSCQS9Z7mB+pfQvEUnGpqamb5lkmMq61NmKYZc1PqAP/SlixcfE3TrAag6brOImGaFGh+mW0QcwFzvUx/EKwABoNAIBGstitWQ4sXejGIyH20wMWUjQClGEIQ3MgL+KwzidMnLqDrXD+6zvXjnuUzsGRlA1gxSFBAQCnAl47C/n2n8N6bn+J02wWkkhaIgGR/DuGI4RLAwZooKgHsgX/04Hm89vJvcer459B0Qsg0UBU3IXTXHJkRI7A9xSbA1/xf7jiEXdsPggiIJ8JgZijlPpCAlAqsOEC+mAQoyRAaYce2A3jjF4dRPT4Cggt2IFcpURRF8zXCnteP4o1fHMa4CdGC1gdSYgJ8s3PmRA+a//UjVI8LQykFBNiXhwA/gtn17weRzyuQIHAAfnkIUF4Mf/bkFzhy8DyiMQNKBuiXjQD2VP3g/nZY2TyECCrZZSVAeLWcU20XoOmiQEggZSLAtfeM3p4MNE0Etr+seQC7Hlg6jLzljMlBRVehXK0qZeVW/2PTuAKwPCRa5sGQjgheBXdonIeAgJsHljxwPWDpyvBaOQfZjI28LTGpNh4QwMyDfuYGgWVmD9g8MikbqaSFZH8Oyf4cBvqzSPblkBywkE5ZyKRt2DkHyQELf/E3jVi8YkYh8fyjIcAHXQgaYhYun5P4GptO2UgNDAG2L+v+nLSQTlrIpvPI5fKwLQnHkVCSCxEcERX6GEIj6IaA40h0dvQBmFGSDF8fteaE3UTPB73nsxQ+706h74uMB2wOyYEcUgMW0ikb2bQNK+fAthw4joJSqrBifAKFNgiwphF0w0DB1POl5oyIvM9Aw1P/sUxAoUtGhM6OPvzuN2fRdqwbn3clkc3koaQqWCASg4D6P+uGgBHSBgHjQavlf/GJYcVXVGry3hP2+xdjfQX4NjbZn8Mbzb/Hwf1nkcvmYRgadENDOHqpxl4MrPsUCSl2E85JtVVjfwX43bT2kz34t5/+Bhe6U4hWhVBVbboTFcxX1dhii5SMWNxEw6yaQog6ajLhYjtbEoTOs33Y9uN30N+bRbw6DDCGOclyiqYRctk8/mR+rdvj8CY8xhwBPra25eDVbQeQzdgIh/WKdtNIEBxHIRIx8LVH7x4W9o5BAlzNevfNE2g/2YNILARZwbK20AjKUchlHfzZhsWYMq268BnHHAEM1+5bOQfv//okwlEDqgKaTzQYqqaTNoQm8J2nl2PR8hmFvseYzIRZMaABbce6caE7iWgsVPJesp8xkzedyQpw8hK27cAwdCxcVo9vPj4PU6ZVlyTzHV0EeN8/OdJ1U452xDLE0HDVC0+lw5BSQjoKihmGoaFmcgx3zq3FkpUNhYinHOBXnADN6yGfO9MLXdeuuafglyWYAaUUpHSnMNibP7o4FyByM18jpCMWD6F6XASTauOoaxiHhpk1qGsYj5CpF3ySnz2XQypKgNAE0inbbero4uqpJrmJkW1L2JYD3dAQiRiIRA1EYiH3e9RAJBpCJBZCNGogWmWiqtpEvNpEPBFGVXUYsarQZZNAP7sup1Q8EUv255DN2BBXmagQgiClQjpjY8ptCSxcVo877p6CiZNiiFaFYIaN60qUlOJCeCmIyqbxo46ATMqCk1cImfqIfkBohFwmj3DUwJ+uW4gVX505WJ+5KKR1C3luhDV88Xg+ouCEBx0GX2edp5i9mooTkMs63j4CXHYFCM0NDWfMrMETf70UU+sSnjNVEJoYpvXDS9al1ehi5QYVJ8Bx5Iiar2mEVNLCvHvq8OT37oUZ1gedqk5QkmHZTtlDN93QoBtibKwA32RcHnwb8xbVYcPfrvCctOszDn3YgeNHu3GhOwXLKh8Bvr4rZjy2biHmL6676XC14gQMtcVDHW4mncftsydi/ffuhaYLKMXY+1/HsXfPcfR9kXFr/7ooe9QiBCGdsvH+2ycxf3HdTVdIK06ArothtpSIkM9LVI+PYP3TyxEydWQzeWz/2X78/qNziMTcEjV4+OhIOQkwDK0QBDDfXJm64gSETP2SoV7pKDzx3aUYXxOFbTl45bn38fHhTlSPj0BJVdEZVIa772HCpNjwdP5WLMYBgBnW3IwY7j6DdMrCVx66C3fNrwUA/GfLERz7304kxkUgHVX5CTxvSOD22ROLEmxVfAWEIwZ0z8HaOQe3zRiPbzx2N5gZ58704p03P0U8EYbjVH63DRGQz0vUTKrCHXMmD/qwW3kFhCMGDNOtA0nJePSJBa5Z8noETl6BRsngtdAEcpk8Vj7gJoJ+/nLLEsAMmBEdkWgI6aSFhY31uGuea3qymTzajnXDNLVRsalP0wQySQu33zkJ9z04G8xcmBC/dQlQCqGQ7q6CkIaHvj2vYOO7Owcw0JeFdh1V0lIF/5oukEnbSEyI4i+fahw+9nIrJ2KKXQ0QgrBo+QxMnhqH4yjoukBvTwZSMkxBUKr8oPv1HukoDCSzmP6lCVj/9HJMqo0XtUVZWSfsafbkadX48gOzhu2cJyJkM3k3CZNl3lLP7PalmVE9PoL7HpyNBx+ZAzOsF/14hYoS4DvX+782G9PqEyBvuTMDd82rxVe+MRudHf1uGYLLpxW6oWHCxBi+dMdEzFkwFYnxkcEC3FgaziVPretmjLsk3AtHdKz97tJREf0o5TrcUkxGjIrJuJHS+UqdpjK0pUklbtZUjgAefGiklJ7Kt+94aJPF3yVTllpYpTJKkNd/pauAUmZT40c4Y7opLyW7M/yOW/8ZDSUGTRce6DTc9o/KuSDyU3OCblx7oqQkIxoL4YN9p3Dkd+ddbRsFPogEwTR1jKuJYvrMGty9YCpmz60tgF/K0cQbXgHMrnaMnxhF+8meEXu6l2obIZO2kRrIYbQIew5ffsL48J3T+FVIQ8OsGqx+ZA5Wrr4DRFSy1XDjBCiANCCeiLgjHtfx2dwtQqNsc47njogIihlnTvTgZz9qxXtvncD6TStQe1tpRhXFzekNMGVa3A0Xr9OYuCMko+jxpur8E73MiIHqRBhHD3biH77/Bv7v8B8gBBV9dvXGCfBs4vwldQiF9TF3QBN7ZFTFTWQzefzzD/8Hbce63QGyIv6vN35Yh9dGbJhVg5l3TkIul6/YdFlpIzaFkKlBSoUX/nEvei9kvPyEK22CUNi28/XH5sLJyzF7Gq6Srknq6U5hx7YPrjngKDkBQnOX4+KVDbincTqSAzlo2tg8N0g6ClXVJg60nsbHhzqL5g+KghYBWL9pBcbVRGHlnFGRXJUyZP3v3R8XLVO/aQJIuGHbxClV2PT3X4WmE+ycMyZXglKMcMTAJ0f+gAvdqcKZSRVfAf5yvHNuLX7wT19HPBFGciBXOBpgLImmE1L9Fo4f7SrkQxUnYDgJU9D03LewZGUD0kkbmbRd8BdDz2q4dR93HLLjVO/oK8b5JNRMrsL3Nz+AQwc68OZ/fIxPj3Uj1W8VdkXSLXxkt9AI2bSNzrN9KIYjKHo9QAyxiwuW1WPBsnp0netH27FudJz+Ar0XMrBteesSINwd9NNnThiaj44eAvyCm++0iIDaugRq6xJjMiq62dxHL7W2FOo+anjR61YPRYvVNdPLpSVj6X6+YiqQsCxrhD0qgZTFp3R1dSVt284EUJTBdHnBST6fTwJwiAgCQO/AwMB5ry4erIRSJnGappgZPT09pzwiNAGAOzo6PiQi1jQtuPKiDP6wra3tXQDYt2+fOxz41ltv7cxZFgEQwSIoVR1JMQCts7Mzv2PHjl8REfbt26f8C5211tZ3DzOzCi50Lu2Fzrt27Wr2/IF7oXNLSwsRkdy5s/kHyWSShBBKqcASFVOkewQYtbe3Wy+++OIPmZk2b97MQ72zBgAvv/zKcx5blnsNeiA3fZ+84yhmtm3b5q1btz41FO9hvsF7Ubz++q6d/pJxHCdg4QZFKcWeOZeO4/BLL73048uBTxeRACKiV1999acPP/zwU/F4HACkZ5KCa2+vMdwXQih4m3/OnTvHu3fv/rtNmzb9iJk1IrpiJZK8u27xzDPPfPujj357JJ/PB+p8AzIwMMCtra3vrl+//ssjmZ2RyhrEzERECoDR1NT0raWNjY/WTZu2KB6PTzVNMwwElwEPj+3dMNOyrHR/f39He3v7B3v37t35/PPPv+2DP5Lmjwhkc3OztnbtWimlHFq4m7JkycpYVZVBlhUA74tpAplMRh04cCAJoGtIcENr1qwRLS0tI5qd/wcGYBNyH1B2jgAAAABJRU5ErkJggg==";

// Full team roster with roles:
// - "owner": full control over everything (Anees, Malik)
// - "head": full control over their own entries only (Sabeeh, Naheema, Azeem, Shafil)
// - "member": can view everything, can only mark their OWN assigned tasks complete
const PEOPLE = [
  { id: "anees", name: "Anees", role: "owner", title: "CEO" },
  { id: "malik", name: "Malik", role: "owner", title: "Admin" },
  { id: "sabeeh", name: "Sabeeh", role: "head", programme: "CUET", color: "#1E8E3E", bg: "#E6F4EA" },
  { id: "naheema", name: "Naheema", role: "head", programme: "Hive", color: "#1A73E8", bg: "#E8F0FE", extraDepts: ["CUET"] },
  { id: "azeem", name: "Azeem", role: "head", programme: "Legal", color: "#8430CE", bg: "#F3E8FD" },
  { id: "shafil", name: "Shafil", role: "head", programme: "Leadgen", color: "#B00020", bg: "#FCE8E8" },
  { id: "safwan", name: "Safwan", role: "member", depts: ["CUET"] },
  { id: "jazeem", name: "Jazeem", role: "member", depts: ["CUET"] },
  { id: "rinsha", name: "Rinsha", role: "member", depts: ["Legal"] },
  { id: "moosa", name: "Moosa", role: "member", depts: ["CUET"] },
  { id: "shaheer", name: "Shaheer", role: "member", depts: ["CUET", "Hive", "Legal", "Leadgen"], actsAsOwner: true },
  { id: "aslam", name: "Aslam", role: "member", depts: ["CUET", "Hive", "Legal", "Leadgen"] },
  { id: "shahasad", name: "Shahasad", role: "member", depts: ["CUET", "Hive", "Legal", "Leadgen"] },
  { id: "asnah", name: "Asnah", role: "member", depts: ["CUET", "Hive", "Legal", "Leadgen"] },
  { id: "basith", name: "Basith", role: "member", depts: ["CUET", "Hive", "Legal", "Leadgen"] },
];

const OWNER_COLOR = "#3C4043";
const OWNER_BG = "#E8EAED";

// HEADS_PUBLIC = the 4 heads only, shown in the legend, login list, and "Entered by"
// picker. Owners (Anees, Malik) are deliberately excluded from all of these — they
// still function with full access once logged in via the separate owner-access link,
// but their names don't clutter the everyday UI. They DO still show up normally
// wherever someone is picked as an assignee (e.g. "Assigned to: Anees").
const HEADS = PEOPLE.filter((p) => p.role === "head").map((p) => ({
  id: p.id,
  name: p.name,
  programme: p.programme,
  color: p.color,
  bg: p.bg,
}));
const OWNERS = PEOPLE.filter((p) => p.role === "owner");

// MEMBERS = full assignable roster (anyone can be assigned a task, regardless of role).
const MEMBERS = PEOPLE.map((p) => p.name);

function personById(id) {
  return PEOPLE.find((p) => p.id === id) || null;
}
function personByName(name) {
  return PEOPLE.find((p) => p.name === name) || null;
}
// For an owner, their "head" identity for entered-by purposes falls back to a
// neutral owner style since they're not tied to one programme.
function headStyleFor(id) {
  const h = HEADS.find((x) => x.id === id);
  if (h) return h;
  const owner = OWNERS.find((o) => o.id === id);
  if (owner) return { id: owner.id, name: owner.name, programme: owner.title, color: OWNER_COLOR, bg: OWNER_BG };
  return null;
}

// The 4 departments, one per head — reused across Analytics and Academics
// so department names always stay consistent with the existing head roster.
const DEPARTMENTS = HEADS.map((h) => ({ name: h.programme, color: h.color, bg: h.bg }));

function deptInfo(name) {
  return DEPARTMENTS.find((d) => d.name === name) || { name, color: "#5f6368", bg: "#f1f3f4" };
}

// Chat rooms: General and Hive are open to everyone. The other three
// department rooms are only visible to people with actual access to that
// department (heads of that dept, owners, and specifically listed members).
const CHAT_ROOMS = [
  { id: "general", name: "General", color: "#5f6368", bg: "#f1f3f4" },
  ...DEPARTMENTS.map((d) => ({ id: d.name.toLowerCase(), name: d.name, color: d.color, bg: d.bg })),
];

// Returns the list of room ids a given PEOPLE entry can see and post in.
function roomsFor(person) {
  if (!person) return [];
  const rooms = new Set(["general", "hive"]); // always open to everyone
  if (person.role === "owner") {
    DEPARTMENTS.forEach((d) => rooms.add(d.name.toLowerCase()));
  } else if (person.role === "head") {
    rooms.add(person.programme.toLowerCase());
    (person.extraDepts || []).forEach((d) => rooms.add(d.toLowerCase()));
  } else {
    (person.depts || []).forEach((d) => rooms.add(d.toLowerCase()));
  }
  return CHAT_ROOMS.filter((r) => rooms.has(r.id));
}

// Returns the list of DEPARTMENTS entries a person can see in Academics and
// Analytics. Different rule from chat rooms: owners AND heads see all 4
// departments (full organizational visibility), while members only see the
// department(s) they're specifically assigned to via their `depts` list.
function visibleDeptsFor(person) {
  if (!person) return [];
  if (person.role === "owner" || person.role === "head") return DEPARTMENTS;
  return DEPARTMENTS.filter((d) => (person.depts || []).includes(d.name));
}

const MEETING_COLOR = "#E37400";
const MEETING_BG = "#FEF3E0";
const EVENT_COLOR = "#0B8043";
const EVENT_BG = "#E3F2E9";

const STATUSES = [
  { id: "not_started", label: "Not started", color: "#5f6368", bg: "#f1f3f4" },
  { id: "in_progress", label: "In progress", color: "#B06000", bg: "#FEF3E0" },
  { id: "completed", label: "Completed", color: "#188038", bg: "#E6F4EA" },
  { id: "blocked", label: "Blocked", color: "#C5221F", bg: "#FCE8E6" },
  { id: "cancelled", label: "Cancelled", color: "#5f6368", bg: "#f1f3f4" },
];
function statusInfo(id) {
  return STATUSES.find((s) => s.id === id) || STATUSES[0];
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function typeLabel(type) {
  if (type === "task") return "Task";
  if (type === "meeting") return "Meeting";
  if (type === "event") return "Event";
  return "Entry";
}

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function toKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }

// Returns the Monday of the week containing the given date, matching the
// Mon-first week layout already used throughout the app's calendars.
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift so Monday becomes the anchor
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function fmtLong(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
function fmtShort(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Formats a "HH:MM" (24-hour, from a <input type="time">) into "2:00 PM" style.
function fmtTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// Generates the list of occurrence dates (as "YYYY-MM-DD" keys) for a recurring
// meeting, starting at startKey and repeating up to and including untilKey.
// Capped at 104 occurrences (2 years of weekly) as a sane upper bound so a
// mistyped far-future end date can't generate thousands of rows.
function generateOccurrences(startKey, untilKey, freq) {
  const dates = [];
  const start = new Date(startKey + "T00:00:00");
  const end = new Date(untilKey + "T00:00:00");
  const anchorDay = start.getDate(); // e.g. 31, for "every 31st (or last day if shorter)"
  let cursor = start;
  let guard = 0;
  while (cursor <= end && guard < 104) {
    dates.push(toKey(cursor));
    if (freq === "monthly") {
      const targetMonthIndex = cursor.getMonth() + 1;
      const daysInTargetMonth = new Date(cursor.getFullYear(), targetMonthIndex + 1, 0).getDate();
      const day = Math.min(anchorDay, daysInTargetMonth); // clamp, e.g. Jan 31 -> Feb 28
      cursor = new Date(cursor.getFullYear(), targetMonthIndex, day);
    } else {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    }
    guard += 1;
  }
  return dates;
}

// Entries are stored as one flat list under a single key, each with its own
// due date (tasks) or meeting date (meetings) — this is the date the entry
// shows up on the calendar under. Tasks also carry an optional start date,
// which is informational only and does not affect placement.
export default function TeamPlanner() {
  const today = new Date();

  // Real auth: `session` comes from Supabase (survives refresh/close automatically,
  // same "stay logged in until you log out" behavior as most apps). `profile` links
  // that authenticated account to one of the 16 known team members via the
  // `profiles` table, so the rest of the app can keep using PEOPLE/roles as before.
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const currentUserId = profile?.person_id || "";
  const currentUser = personById(currentUserId);
  // isOwner drives PERMISSIONS (what someone can edit/manage) everywhere in
  // the app. Shaheer has `actsAsOwner: true` — full owner-level edit rights —
  // while still keeping role: "member" for all DISPLAY purposes (login list,
  // legend, "Owner access" gating), which read `role` directly and are
  // intentionally untouched by this.
  const isOwner = currentUser?.role === "owner" || currentUser?.actsAsOwner === true;
  const isHead = currentUser?.role === "head";
  const isMember = currentUser?.role === "member";
  const canManageOwn = isOwner || isHead; // can add/edit/delete their own entries

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setSession(data.session);
        setAuthLoaded(true);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setProfile(null);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!cancelled) {
        if (error) console.error("Profile fetch error:", error);
        setProfile(data || null);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  // Heartbeat: while someone is logged in and has the app open, ping
  // last_seen every 30 seconds. The Online Status panel considers anyone
  // seen within the last 60 seconds to be "online" — two heartbeats of
  // buffer so a single missed tick (e.g. brief network hiccup) doesn't
  // flip someone to offline prematurely.
  useEffect(() => {
    if (!profile?.id) return;
    async function ping() {
      const { error } = await supabase.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", profile.id);
      if (error) console.error("last_seen heartbeat error:", error);
    }
    ping(); // immediately on login, don't wait 30s for the first one
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, [profile?.id]);

  async function logOut() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  async function handleSignUp() {
    setAuthError("");
    if (!signupPersonId) {
      setAuthError("Pick your name first.");
      return;
    }
    if (!authEmail.trim() || !authPassword) {
      setAuthError("Enter an email and password.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password needs to be at least 6 characters.");
      return;
    }
    setAuthBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
      setAuthBusy(false);
      return;
    }
    // If email confirmation is required, there's no session yet — the profile
    // gets linked once they confirm and their first sign-in fires onAuthStateChange.
    // If confirmation is off, `data.session` exists immediately and we can link now.
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, person_id: signupPersonId, email: authEmail.trim() });
      if (profileError) {
        console.error("Profile link error:", profileError);
        if (profileError.code === "23505" || /unique/i.test(profileError.message || "")) {
          setAuthError(`${personById(signupPersonId)?.name} already has an account. If that's you, log in instead — otherwise pick a different name.`);
          setAuthBusy(false);
          return;
        }
      }
    }
    setAuthBusy(false);
    if (data.session) {
      setSession(data.session);
    } else {
      setAuthMessage("Check your email for a confirmation link, then sign in below.");
      setAuthMode("signin");
      setAuthPassword("");
    }
  }

  async function handleSignIn() {
    setAuthError("");
    if (!authEmail.trim() || !authPassword) {
      setAuthError("Enter your email and password.");
      return;
    }
    setAuthBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });
    setAuthBusy(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSession(data.session);
    // Record this login so owners can see it in the Online Status panel.
    // Fire-and-forget — a failure here shouldn't block the person logging in.
    supabase.from("profiles").update({ last_login: new Date().toISOString() }).eq("id", data.session.user.id)
      .then(({ error: e }) => { if (e) console.error("last_login update error:", e); });
  }

  const [pickerName, setPickerName] = useState("");
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup-name" | "signup-details"
  const [signupPersonId, setSignupPersonId] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeScreen, setActiveScreen] = useState("planner"); // "planner" | "analytics" | "academics" | "chat"
  const [unreadByRoom, setUnreadByRoom] = useState({}); // { roomId: count }

  const fetchUnreadCounts = useCallback(async () => {
    if (!currentUserId) { setUnreadByRoom({}); return; }
    const myRoomIds = roomsFor(currentUser).map((r) => r.id);
    if (myRoomIds.length === 0) { setUnreadByRoom({}); return; }

    const { data: readStates, error: readError } = await supabase
      .from("chat_read_state")
      .select("room, last_read_at")
      .eq("person_id", currentUserId);
    if (readError) { console.error("Read-state fetch error:", readError); return; }
    const lastReadByRoom = {};
    for (const r of readStates || []) lastReadByRoom[r.room] = r.last_read_at;

    const counts = {};
    await Promise.all(myRoomIds.map(async (roomId) => {
      const lastRead = lastReadByRoom[roomId];
      let query = supabase.from("chat_messages").select("id", { count: "exact", head: true }).eq("room", roomId);
      if (lastRead) query = query.gt("created_at", lastRead);
      const { count, error } = await query;
      if (error) { console.error(`Unread count error for ${roomId}:`, error); return; }
      counts[roomId] = count || 0;
    }));
    setUnreadByRoom(counts);
  }, [currentUserId, currentUser]);

  useEffect(() => {
    fetchUnreadCounts();
    if (!currentUserId) return;
    // Any new message in any room this person can access should refresh the
    // counts live — cheaper to just re-fetch counts than track every message.
    const channel = supabase
      .channel("unread-tracker")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, fetchUnreadCounts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchUnreadCounts, currentUserId]);

  const totalUnread = Object.values(unreadByRoom).reduce((sum, n) => sum + n, 0);

  async function markRoomRead(roomId) {
    if (!currentUserId) return;
    const { error } = await supabase
      .from("chat_read_state")
      .upsert({ person_id: currentUserId, room: roomId, last_read_at: new Date().toISOString() }, { onConflict: "person_id,room" });
    if (error) { console.error("Mark read error:", error); return; }
    setUnreadByRoom((prev) => ({ ...prev, [roomId]: 0 }));
  }

  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "list"
  const [activeFilters, setActiveFilters] = useState(() => new Set());
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  function showToast(message) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  }
  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, []);

  function toggleFilter(key) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("task");
  const [formHead, setFormHead] = useState(HEADS[0].id);
  const [formAssignee, setFormAssignee] = useState(MEMBERS[0]);
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState("not_started");
  const [formStart, setFormStart] = useState("");
  const [formDue, setFormDue] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formRepeat, setFormRepeat] = useState(false);
  const [formRepeatFreq, setFormRepeatFreq] = useState("weekly"); // "weekly" | "monthly"
  const [formRepeatUntil, setFormRepeatUntil] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Fetch error:", error);
      return;
    }
    const mapped = (data || []).map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      head: row.head,
      assignee: row.assignee,
      status: row.status,
      startDate: row.start_date,
      dueDate: row.due_date,
      time: row.time,
      notes: row.notes,
    }));
    setEntries(mapped);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchEntries();
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [fetchEntries]);

  // Live updates: whenever anyone adds, edits, or deletes an entry, every open
  // copy of the app re-fetches automatically — no manual refresh needed.
  useEffect(() => {
    const channel = supabase
      .channel("entries-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, () => {
        fetchEntries();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // (Supabase writes happen directly in submitForm / deleteEntry / cycleStatus below —
  // each action targets exactly the row it changes, rather than rewriting one big blob.)

  const daysInGrid = (() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  })();

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function openForm(type) {
    setEditingId(null);
    setFormType(type);
    setFormHead(currentUser && (currentUser.role === "head" || currentUser.role === "owner") ? currentUser.id : HEADS[0].id);
    setFormAssignee(MEMBERS[0]);
    setFormTitle("");
    setFormStatus("not_started");
    setFormStart(selectedDate);
    setFormDue(selectedDate);
    setFormTime("");
    setFormNotes("");
    setFormRepeat(false);
    setFormRepeatFreq("weekly");
    setFormRepeatUntil("");
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(entry) {
    if (!canEditEntry(entry)) return;
    setEditingId(entry.id);
    setFormType(entry.type);
    setFormHead(entry.head || (currentUser && (currentUser.role === "head" || currentUser.role === "owner") ? currentUser.id : HEADS[0].id));
    setFormAssignee(entry.assignee || MEMBERS[0]);
    setFormTitle(entry.title || "");
    setFormStatus(entry.status || "not_started");
    setFormStart(entry.startDate || entry.dueDate || "");
    setFormDue(entry.dueDate || "");
    setFormTime(entry.time || "");
    setFormNotes(entry.notes || "");
    setFormRepeat(false); // editing never regenerates a series — just this one occurrence
    setFormRepeatFreq("weekly");
    setFormRepeatUntil("");
    setFormError("");
    setShowForm(true);
  }

  async function submitForm() {
    if (!canManageOwn) {
      setFormError("You don't have permission to add entries.");
      return;
    }
    if (!formTitle.trim()) {
      setFormError(`Enter a${formType === "event" ? "n" : ""} ${typeLabel(formType).toLowerCase()} name first`);
      return;
    }
    if (!formDue) {
      setFormError(`Pick a${formType === "event" ? "n" : ""} ${formType === "task" ? "due" : typeLabel(formType).toLowerCase()} date`);
      return;
    }
    if (formType === "task" && formStart && formDue && formStart > formDue) {
      setFormError("Start date is after the due date");
      return;
    }
    if (formType === "task" && isHead && formHead !== currentUser.id) {
      setFormError("You can only enter tasks under your own name.");
      return;
    }
    if (formType === "meeting" && formRepeat) {
      if (!formRepeatUntil) {
        setFormError("Pick an end date for the repeat.");
        return;
      }
      if (formRepeatUntil < formDue) {
        setFormError("Repeat end date is before the meeting date.");
        return;
      }
    }
    setSaving(true);

    if (editingId) {
      // Editing an existing entry: update in place, keep its original id/type.
      const updates = {
        title: formTitle.trim(),
        head: formType === "task" ? formHead : null,
        assignee: formType === "task" ? formAssignee : null,
        status: formType === "task" ? formStatus : null,
        start_date: formType === "task" ? (formStart || formDue) : null,
        due_date: formDue,
        time: formTime.trim(),
        notes: formNotes.trim(),
      };
      const { error } = await supabase.from("entries").update(updates).eq("id", editingId);
      if (error) {
        console.error("Update error:", error);
        setFormError("Couldn't save. Check your connection and try again.");
        setSaving(false);
        return;
      }
      await fetchEntries();
      setSaving(false);
      setShowForm(false);
      setEditingId(null);
      showToast(`${typeLabel(formType)} updated`);
      return;
    }

    const baseEntry = {
      type: formType,
      title: formTitle.trim(),
      head: formType === "task" ? formHead : null,
      assignee: formType === "task" ? formAssignee : null,
      status: formType === "task" ? formStatus : null,
      start_date: formType === "task" ? (formStart || formDue) : null,
      time: formTime.trim(),
      notes: formNotes.trim(),
    };

    const occurrenceDates = (formType === "meeting" && formRepeat)
      ? generateOccurrences(formDue, formRepeatUntil, formRepeatFreq)
      : [formDue];

    const rows = occurrenceDates.map((dueKey, i) => ({
      ...baseEntry,
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      due_date: dueKey,
    }));

    const { error } = await supabase.from("entries").insert(rows);
    if (error) {
      console.error("Insert error:", error);
      setFormError("Couldn't save. Check your connection and try again.");
      setSaving(false);
      return;
    }
    await fetchEntries();
    setSaving(false);
    setShowForm(false);
    showToast(rows.length > 1 ? `${rows.length} meetings added` : `${typeLabel(formType)} added`);
  }

  function canEditEntry(entry) {
    if (!entry) return false;
    if (isOwner) return true;
    if (entry.type === "meeting" || entry.type === "event") return isHead; // any head/owner can manage these for now
    // tasks: a head can only touch tasks they themselves entered
    return isHead && entry.head === currentUserId;
  }

  async function deleteEntry(id) {
    const entry = entries.find((e) => e.id === id);
    if (!canEditEntry(entry)) return;
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast(`${typeLabel(entry.type)} deleted`);
  }

  async function cycleStatus(id) {
    const current = entries.find((e) => e.id === id);
    if (!current) return;
    const order = ["not_started", "in_progress", "completed", "blocked", "cancelled"];
    const currentStatus = current.status || "not_started";

    // Members can only toggle their OWN assigned task between "not started" and "completed" —
    // they don't get the full 5-state cycle, and can't touch anyone else's task.
    if (isMember) {
      if (current.assignee !== currentUser.name) return;
      const next = currentStatus === "completed" ? "not_started" : "completed";
      const { error } = await supabase.from("entries").update({ status: next }).eq("id", id);
      if (error) { console.error("Status update error:", error); return; }
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: next } : e)));
      showToast(next === "completed" ? "Marked complete" : "Marked not started");
      return;
    }

    // Owners/heads get the full cycle, but heads only on entries they own.
    if (!canEditEntry(current)) return;
    const next = order[(order.indexOf(currentStatus) + 1) % order.length];
    const { error } = await supabase.from("entries").update({ status: next }).eq("id", id);
    if (error) {
      console.error("Status update error:", error);
      return;
    }
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: next } : e)));
    showToast(`Status: ${statusInfo(next).label}`);
  }

  function headInfo(headId) {
    return headStyleFor(headId);
  }

  // Declared here (not later, near the other stats) because matchesFilters
  // below needs it immediately — a `const` used before its declaration line
  // throws "Cannot access before initialization", which is exactly the bug
  // that caused the blank-screen crash when tapping the Overdue stat card.
  const todayKey = toKey(today);

  // An entry passes if it matches ANY active filter chip (OR logic) — e.g. selecting
  // "Sabeeh" and "Meetings" shows Sabeeh's tasks plus all meetings, not just their overlap.
  // With no filters active, everything shows (the normal, unfiltered view).
  // Stat-card filters ("status-completed" etc.) are exclusive by convention —
  // tapping one clears any other active filters first (see toggleStatFilter).
  function matchesFilters(e) {
    if (activeFilters.size === 0) return true;
    if (activeFilters.has("status-completed")) return e.type === "task" && e.status === "completed";
    if (activeFilters.has("status-in_progress")) return e.type === "task" && e.status === "in_progress";
    if (activeFilters.has("status-overdue")) {
      if (e.type !== "task" || !e.dueDate) return false;
      if (e.status === "completed" || e.status === "cancelled") return false;
      return e.dueDate < todayKey;
    }
    if (activeFilters.has("mine") && currentUser && e.type === "task" && e.assignee === currentUser.name) return true;
    if (activeFilters.has(e.type) && (e.type === "meeting" || e.type === "event")) return true;
    if (e.type === "task" && e.head && activeFilters.has(e.head)) return true;
    return false;
  }

  // Stat cards act as exclusive shortcuts: tapping one clears whatever else
  // was active, shows just that slice, AND switches to List view — a filtered
  // stat like "Overdue" reads as a clean list, not scattered dots on a
  // calendar grid. Tapping the same card again clears the filter and
  // returns to Calendar view.
  function toggleStatFilter(key) {
    const clearing = activeFilters.has(key) && activeFilters.size === 1;
    setActiveFilters(clearing ? new Set() : new Set([key]));
    setViewMode(clearing ? "calendar" : "list");
  }

  const filteredEntries = entries.filter(matchesFilters);

  const entriesByDate = {};
  for (const e of filteredEntries) {
    const key = e.dueDate;
    if (!key) continue;
    if (!entriesByDate[key]) entriesByDate[key] = [];
    entriesByDate[key].push(e);
  }

  const selectedList = entriesByDate[selectedDate] || [];
  const selectedDateObj = new Date(selectedDate + "T00:00:00");

  const tasks = entries.filter((e) => e.type === "task");
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((e) => e.status === "completed").length;
  const inProgressTasks = tasks.filter((e) => e.status === "in_progress").length;
  const blockedTasks = tasks.filter((e) => e.status === "blocked").length;
  const overdueTasks = tasks.filter((e) => {
    if (!e.dueDate) return false;
    if (e.status === "completed" || e.status === "cancelled") return false;
    return e.dueDate < todayKey;
  }).length;

  // Leaderboard: completion rate among tasks DUE this calendar month, grouped by
  // assignee. Only counts people with at least one task due this month, so an
  // empty roster slot doesn't show as "0%" and clutter the ranking.
  const monthPrefix = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
  const monthTasks = tasks.filter((e) => e.dueDate && e.dueDate.startsWith(monthPrefix));
  const leaderboard = MEMBERS
    .map((name) => {
      const mine = monthTasks.filter((e) => e.assignee === name);
      const done = mine.filter((e) => e.status === "completed").length;
      const rate = mine.length > 0 ? Math.round((done / mine.length) * 100) : null;
      return { name, total: mine.length, done, rate };
    })
    .filter((row) => row.total > 0)
    .sort((a, b) => b.rate - a.rate || b.total - a.total);

  if (!authLoaded) {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ fontSize: 13, color: "#70757a" }}>Loading…</div>
      </div>
    );
  }

  if (!session || !currentUser) {
    const visiblePeople = PEOPLE.filter((p) => p.role !== "owner");
    const matches = visiblePeople.filter((p) => p.name.toLowerCase().includes(pickerName.trim().toLowerCase()));
    const nameChoices = showOwnerLogin ? OWNERS : matches;

    // Signed in but no linked profile — happens if profile-linking failed after
    // signup, or an account exists with no roster match. Offer a way to relink
    // rather than silently stranding them on a blank screen.
    if (session && !currentUser) {
      const linkChoices = showOwnerLogin ? OWNERS : visiblePeople;
      return (
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src={LOGO_SRC} alt="Leadera logo" style={{ width: 40, height: 40, borderRadius: 9, flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#202124" }}>Leadera Family</h1>
              <p style={{ fontSize: 13, color: "#5f6368", margin: "2px 0 0" }}>One more step</p>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#5f6368", marginBottom: 14 }}>
            Your account isn't linked to a name yet. Pick your name to finish setting up.
          </div>
          {authError && <div style={{ fontSize: 12, color: "#c5221f", marginBottom: 12 }}>{authError}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {linkChoices.map((p) => (
              <button
                key={p.id}
                onClick={async () => {
                  setAuthError("");
                  const { error } = await supabase
                    .from("profiles")
                    .insert({ id: session.user.id, person_id: p.id, email: session.user.email });
                  if (!error) {
                    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
                    setProfile(data || null);
                  } else if (error.code === "23505" || /unique/i.test(error.message || "")) {
                    setAuthError(`${p.name} already has an account. If that's not you, pick a different name.`);
                  } else {
                    setAuthError("Couldn't link that name. Try again.");
                  }
                }}
                style={{
                  textAlign: "left", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #dadce0", background: "#fff", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>{p.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOwnerLogin((v) => !v)}
            style={{ marginTop: 20, border: "none", background: "transparent", color: showOwnerLogin ? "#1a73e8" : "#9aa0a6", fontSize: 11.5, fontWeight: showOwnerLogin ? 600 : 400, cursor: "pointer", padding: 0, textDecoration: showOwnerLogin ? "none" : "underline" }}
          >
            {showOwnerLogin ? "← Back" : "Owner access"}
          </button>
          <div style={{ marginTop: 16 }}>
            <button
              onClick={logOut}
              style={{ border: "none", background: "transparent", color: "#1a73e8", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}
            >
              Log out
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <img src={LOGO_SRC} alt="Leadera logo" style={{ width: 40, height: 40, borderRadius: 9, flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#202124" }}>Leadera Family</h1>
            <p style={{ fontSize: 13, color: "#5f6368", margin: "2px 0 0" }}>
              {authMode === "signin" ? "Log in" : "Create your account"}
            </p>
          </div>
        </div>

        {authMessage && (
          <div style={{ fontSize: 12.5, color: "#188038", background: "#E6F4EA", padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>
            {authMessage}
          </div>
        )}

        {authMode === "signin" && (
          <>
            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Email</div>
            <input
              value={authEmail}
              onChange={(e) => { setAuthEmail(e.target.value); if (authError) setAuthError(""); }}
              placeholder="you@example.com"
              type="email"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Password</div>
            <input
              value={authPassword}
              onChange={(e) => { setAuthPassword(e.target.value); if (authError) setAuthError(""); }}
              placeholder="••••••••"
              type="password"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            {authError && <div style={{ fontSize: 12, color: "#c5221f", marginBottom: 10 }}>{authError}</div>}
            <button
              onClick={handleSignIn}
              disabled={authBusy}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                background: "#1a73e8", color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.7 : 1, marginBottom: 12,
              }}
            >
              {authBusy ? "Logging in…" : "Log in"}
            </button>
            <button
              onClick={() => { setAuthMode("signup-name"); setAuthError(""); setAuthMessage(""); }}
              style={{ width: "100%", border: "none", background: "transparent", color: "#1a73e8", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}
            >
              New here? Create an account
            </button>
          </>
        )}

        {authMode === "signup-name" && (
          <>
            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Find your name</div>
            <input
              value={pickerName}
              onChange={(e) => setPickerName(e.target.value)}
              placeholder="Type to search"
              style={{ ...inputStyle, marginBottom: 14 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {nameChoices.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSignupPersonId(p.id); setAuthMode("signup-details"); }}
                  style={{
                    textAlign: "left", padding: "11px 14px", borderRadius: 10,
                    border: "1px solid #dadce0", background: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>{p.name}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 999,
                    color: p.color || OWNER_COLOR, background: p.bg || OWNER_BG,
                  }}>
                    {p.role === "head" ? p.programme : p.role === "owner" ? p.title : "Member"}
                  </span>
                </button>
              ))}
              {nameChoices.length === 0 && (
                <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0" }}>No one matches that name.</div>
              )}
            </div>
            {!showOwnerLogin ? (
              <button
                onClick={() => setShowOwnerLogin(true)}
                style={{ marginTop: 28, border: "none", background: "transparent", color: "#9aa0a6", fontSize: 11.5, cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Owner access
              </button>
            ) : (
              <button
                onClick={() => setShowOwnerLogin(false)}
                style={{ marginTop: 16, border: "none", background: "transparent", color: "#1a73e8", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}
              >
                ← Back
              </button>
            )}
            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => { setAuthMode("signin"); setAuthError(""); }}
                style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 12.5, cursor: "pointer", padding: 0 }}
              >
                ← Already have an account? Log in
              </button>
            </div>
          </>
        )}

        {authMode === "signup-details" && (
          <>
            <div style={{ fontSize: 12.5, color: "#5f6368", marginBottom: 14 }}>
              Signing up as <strong style={{ color: "#202124" }}>{personById(signupPersonId)?.name}</strong>
            </div>
            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Email</div>
            <input
              value={authEmail}
              onChange={(e) => { setAuthEmail(e.target.value); if (authError) setAuthError(""); }}
              placeholder="you@example.com"
              type="email"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Password</div>
            <input
              value={authPassword}
              onChange={(e) => { setAuthPassword(e.target.value); if (authError) setAuthError(""); }}
              placeholder="At least 6 characters"
              type="password"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            {authError && <div style={{ fontSize: 12, color: "#c5221f", marginBottom: 10 }}>{authError}</div>}
            <button
              onClick={handleSignUp}
              disabled={authBusy}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                background: "#1a73e8", color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: authBusy ? "default" : "pointer", opacity: authBusy ? 0.7 : 1, marginBottom: 12,
              }}
            >
              {authBusy ? "Creating account…" : "Create account"}
            </button>
            <button
              onClick={() => setAuthMode("signup-name")}
              style={{ width: "100%", border: "none", background: "transparent", color: "#5f6368", fontSize: 12.5, cursor: "pointer", padding: 0 }}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", paddingBottom: 150 }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 15, background: "#fff",
        borderBottom: "1px solid #e8eaed", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={LOGO_SRC}
            alt="Leadera logo"
            style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#202124" }}>Leadera Family</h1>
            <p style={{ fontSize: 13, color: "#5f6368", margin: "2px 0 0" }}>
              Everyone's tasks and meetings, one place
            </p>
          </div>
          <button
            onClick={() => setActiveScreen("chat")}
            aria-label="Notifications"
            style={{ position: "relative", border: "none", background: "transparent", cursor: "pointer", padding: 8, flexShrink: 0 }}
          >
            <span style={{ fontSize: 20 }}>🔔</span>
            {totalUnread > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2, background: "#C5221F", color: "#fff",
                fontSize: 9.5, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
                border: "1.5px solid #fff",
              }}>
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 10px" }}>
          <span style={{ fontSize: 12, color: "#70757a" }}>
            Signed in as <strong style={{ color: "#202124", fontWeight: 600 }}>{currentUser.name}</strong>
            {isOwner ? ` · ${currentUser.title}` : isHead ? ` · ${currentUser.programme}` : ""}
          </span>
          <button
            onClick={logOut}
            style={{ border: "none", background: "transparent", color: "#1a73e8", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}
          >
            Log out
          </button>
        </div>
      </div>

      {activeScreen === "planner" && (
      <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" }}>
        {HEADS.map((h) => (
          <span key={h.id} style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", background: h.color, padding: "3px 9px", borderRadius: 999 }}>
            {h.name} · {h.programme}
          </span>
        ))}
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", background: MEETING_COLOR, padding: "3px 9px", borderRadius: 999 }}>
          Meetings
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", background: EVENT_COLOR, padding: "3px 9px", borderRadius: 999 }}>
          Events
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, padding: "0 16px 14px" }}>
        <SummaryStat label="Total" value={totalTasks} color="#202124" onClick={() => { setActiveFilters(new Set()); setViewMode("calendar"); }} active={activeFilters.size === 0} />
        <SummaryStat label="Completed" value={completedTasks} color="#188038" onClick={() => toggleStatFilter("status-completed")} active={activeFilters.has("status-completed")} />
        <SummaryStat label="In progress" value={inProgressTasks} color="#B06000" onClick={() => toggleStatFilter("status-in_progress")} active={activeFilters.has("status-in_progress")} />
        <SummaryStat label="Overdue" value={overdueTasks} color="#C5221F" onClick={() => toggleStatFilter("status-overdue")} active={activeFilters.has("status-overdue")} />
      </div>
      {activeFilters.has("status-completed") || activeFilters.has("status-in_progress") || activeFilters.has("status-overdue") ? (
        <div style={{ padding: "0 16px 10px", fontSize: 11.5, color: "#5f6368" }}>
          Showing {activeFilters.has("status-completed") ? "completed" : activeFilters.has("status-in_progress") ? "in-progress" : "overdue"} tasks only —{" "}
          <button onClick={() => { setActiveFilters(new Set()); setViewMode("calendar"); }} style={{ border: "none", background: "transparent", color: "#1a73e8", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 11.5 }}>
            clear
          </button>
        </div>
      ) : null}

      <div style={{ padding: "0 16px 14px", position: "relative" }}>
        <button
          onClick={() => setShowLeaderboard((v) => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px", borderRadius: 10, border: "1px solid #dadce0", background: "#fff",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#202124",
          }}
        >
          <span>🏆 This month's leaderboard</span>
          <span style={{ color: "#5f6368", fontSize: 12 }}>{showLeaderboard ? "Hide ▲" : "Show ▼"}</span>
        </button>
        {showLeaderboard && (
          <>
            {/* Invisible full-screen backdrop — tapping anywhere outside the
                panel closes it, same as the Filter dropdown. */}
            <div
              onClick={() => setShowLeaderboard(false)}
              style={{ position: "fixed", inset: 0, zIndex: 19 }}
            />
            <div style={{
              position: "absolute", top: "100%", left: 16, marginTop: 4,
              width: "calc(100% - 32px)", maxHeight: 320, overflowY: "auto",
              border: "1px solid #dadce0", borderRadius: 10, overflow: "hidden",
              background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", zIndex: 20,
            }}>
              {leaderboard.length === 0 ? (
                <div style={{ padding: "12px 14px", fontSize: 12.5, color: "#70757a" }}>
                  No tasks due this month yet.
                </div>
              ) : (
                leaderboard.map((row, idx) => (
                  <div
                    key={row.name}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                      borderTop: idx === 0 ? "none" : "1px solid #f1f3f4",
                      background: idx === 0 ? "#FFFBEA" : "#fff",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: idx === 0 ? "#B06000" : "#70757a", width: 20 }}>
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                    </span>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: "#202124" }}>{row.name}</span>
                    <span style={{ fontSize: 11.5, color: "#70757a" }}>{row.done}/{row.total}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, minWidth: 40, textAlign: "right",
                      color: row.rate >= 70 ? "#188038" : row.rate >= 40 ? "#B06000" : "#C5221F",
                    }}>
                      {row.rate}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "0 16px 10px", position: "relative" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            onClick={() => setShowFilterPanel((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              border: activeFilters.size > 0 ? "1.5px solid #1a73e8" : "1px solid #dadce0",
              background: activeFilters.size > 0 ? "#E8F0FE" : "#fff",
              color: activeFilters.size > 0 ? "#1a73e8" : "#5f6368",
              fontSize: 12, fontWeight: 600, padding: "7px 10px", borderRadius: 8, cursor: "pointer",
            }}
          >
            ⚲ Filter{activeFilters.size > 0 ? ` (${activeFilters.size})` : ""} {showFilterPanel ? "▲" : "▼"}
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            style={{
              flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              border: viewMode === "calendar" ? "2px solid #1a73e8" : "1px solid #dadce0",
              background: viewMode === "calendar" ? "#E8F0FE" : "#fff",
              color: viewMode === "calendar" ? "#1a73e8" : "#5f6368",
            }}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              border: viewMode === "list" ? "2px solid #1a73e8" : "1px solid #dadce0",
              background: viewMode === "list" ? "#E8F0FE" : "#fff",
              color: viewMode === "list" ? "#1a73e8" : "#5f6368",
            }}
          >
            ☰ List
          </button>
        </div>

        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 11.5, cursor: "pointer", padding: "6px 0 0" }}
          >
            Clear filter
          </button>
        )}

        {showFilterPanel && (
          <>
            {/* Invisible full-screen backdrop — tapping anywhere outside the
                panel closes it, same as Amazon's sort menu behavior. */}
            <div
              onClick={() => setShowFilterPanel(false)}
              style={{ position: "fixed", inset: 0, zIndex: 19 }}
            />
            <div style={{
              position: "absolute", top: "100%", left: 16, marginTop: 4,
              display: "flex", flexWrap: "wrap", gap: 6, width: "calc(100% - 32px)",
              background: "#fff", border: "1px solid #dadce0", borderRadius: 10, padding: 10,
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)", zIndex: 20,
            }}>
              <FilterChip label="My tasks" active={activeFilters.has("mine")} color="#1a73e8" bg="#E8F0FE" onClick={() => { toggleFilter("mine"); setShowFilterPanel(false); }} />
              {HEADS.map((h) => (
                <FilterChip key={h.id} label={h.name} active={activeFilters.has(h.id)} color={h.color} bg={h.bg} onClick={() => { toggleFilter(h.id); setShowFilterPanel(false); }} />
              ))}
              <FilterChip label="Meetings" active={activeFilters.has("meeting")} color={MEETING_COLOR} bg={MEETING_BG} onClick={() => { toggleFilter("meeting"); setShowFilterPanel(false); }} />
              <FilterChip label="Events" active={activeFilters.has("event")} color={EVENT_COLOR} bg={EVENT_BG} onClick={() => { toggleFilter("event"); setShowFilterPanel(false); }} />
            </div>
          </>
        )}
      </div>

      {viewMode === "calendar" ? (
      <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 10px" }}>
        <button onClick={() => changeMonth(-1)} aria-label="Previous month" style={navBtnStyle}>‹</button>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#202124" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button onClick={() => changeMonth(1)} aria-label="Next month" style={navBtnStyle}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px" }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 600, color: "#70757a", padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "4px 10px 8px" }}>
        {daysInGrid.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const key = toKey(date);
          const dayItems = entriesByDate[key] || [];
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          const dots = dayItems.slice(0, 4).map((e) => {
            if (e.type === "meeting") return MEETING_COLOR;
            if (e.type === "event") return EVENT_COLOR;
            const h = headInfo(e.head);
            return h ? h.color : "#5f6368";
          });
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(key)}
              style={{
                border: "none",
                background: isSelected ? "#1a73e8" : isToday ? "#e8f0fe" : "transparent",
                borderRadius: 10, padding: "6px 2px 5px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minHeight: 44,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? "#fff" : isToday ? "#1a73e8" : "#202124" }}>
                {date.getDate()}
              </span>
              <div style={{ display: "flex", gap: 2, minHeight: 5 }}>
                {dots.map((c, i) => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#fff" : c }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#202124", margin: "6px 0 8px" }}>
          {fmtLong(selectedDateObj)}
        </div>

        {!loaded ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0" }}>Loading…</div>
        ) : selectedList.length === 0 ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0 16px" }}>
            Nothing due here. Add a task, meeting, or event below.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 12 }}>
            {selectedList.map((e) => {
              const isTask = e.type === "task";
              const isMeeting = e.type === "meeting";
              const isEvent = e.type === "event";
              const h = headInfo(e.head);
              const color = isMeeting ? MEETING_COLOR : isEvent ? EVENT_COLOR : (h ? h.color : "#5f6368");
              const bg = isMeeting ? MEETING_BG : isEvent ? EVENT_BG : (h ? h.bg : "#f1f3f4");
              const isMyTask = isTask && currentUser && e.assignee === currentUser.name;
              const canChangeStatus = isTask && (canEditEntry(e) || isMyTask);
              const canDelete = canEditEntry(e);
              return (
                <div key={e.id} style={{ background: bg, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#202124", wordBreak: "break-word" }}>
                        {e.title}
                      </span>
                      {isMyTask && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#1a73e8", background: "#E8F0FE", padding: "1px 6px", borderRadius: 999 }}>
                          YOURS
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13 }}>
                      {isTask ? `${e.assignee || "Unassigned"} · entered by ${h ? h.name : "Unknown"}` : typeLabel(e.type)}
                      {e.time ? ` · ${e.time}` : ""}
                    </div>
                    {isTask && (
                      canChangeStatus ? (
                        <button
                          onClick={() => cycleStatus(e.id)}
                          style={{
                            marginLeft: 13, marginTop: 4, border: "none", cursor: "pointer",
                            fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                            color: statusInfo(e.status).color, background: statusInfo(e.status).bg,
                          }}
                        >
                          {statusInfo(e.status).label} · tap to {isMember ? "toggle" : "change"}
                        </button>
                      ) : (
                        <span style={{
                          display: "inline-block", marginLeft: 13, marginTop: 4,
                          fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                          color: statusInfo(e.status).color, background: statusInfo(e.status).bg,
                        }}>
                          {statusInfo(e.status).label}
                        </span>
                      )
                    )}
                    {isTask && e.startDate && e.startDate !== e.dueDate && (
                      <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13, marginTop: 1 }}>
                        Starts {fmtShort(e.startDate)} · due {fmtShort(e.dueDate)}
                      </div>
                    )}
                    {e.notes && (
                      <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13, marginTop: 2 }}>
                        {e.notes}
                      </div>
                    )}
                  </div>
                  {canDelete && (
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                      <button
                        onClick={() => openEditForm(e)}
                        aria-label="Edit"
                        style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 13, cursor: "pointer", padding: 4, lineHeight: 1 }}
                      >✏️</button>
                      <button
                        onClick={() => deleteEntry(e.id)}
                        aria-label="Delete"
                        style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 15, cursor: "pointer", padding: 4, lineHeight: 1 }}
                      >×</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      ) : (
        <ListView
          entries={filteredEntries}
          todayKey={todayKey}
          currentUser={currentUser}
          isMember={isMember}
          headInfo={headInfo}
          canEditEntry={canEditEntry}
          openEditForm={openEditForm}
          deleteEntry={deleteEntry}
          cycleStatus={cycleStatus}
          isStatFiltered={activeFilters.has("status-completed") || activeFilters.has("status-in_progress") || activeFilters.has("status-overdue")}
        />
      )}

      {showForm && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#202124", marginBottom: 10 }}>
              {editingId ? "Edit" : "New"} {typeLabel(formType).toLowerCase()}
            </div>

            {formType === "task" && (
              <>
                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Entered by</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                  {(isOwner ? HEADS : HEADS.filter((h) => h.id === currentUserId)).map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setFormHead(h.id)}
                      style={{
                        flex: isOwner ? "1 1 30%" : 1, padding: "7px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: formHead === h.id ? `2px solid ${h.color}` : "1px solid #dadce0",
                        background: formHead === h.id ? h.bg : "#fff",
                        color: formHead === h.id ? h.color : "#5f6368",
                        cursor: "pointer",
                      }}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Assigned to</div>
                <select
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  {MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Status</div>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 12 }}
                >
                  {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </>
            )}

            <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>
              {formType === "task" ? "Task name" : `${typeLabel(formType)} title`}
            </div>
            <input
              value={formTitle}
              onChange={(e) => { setFormTitle(e.target.value); if (formError) setFormError(""); }}
              placeholder={formType === "task" ? "Prepare CUET registration list" : formType === "event" ? "Team outing" : "Weekly sync"}
              style={inputStyle}
            />

            {formType === "task" ? (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Start date</div>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => { setFormStart(e.target.value); if (formError) setFormError(""); }}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Due date</div>
                  <input
                    type="date"
                    value={formDue}
                    onChange={(e) => { setFormDue(e.target.value); if (formError) setFormError(""); }}
                    style={inputStyle}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Date</div>
                <input
                  type="date"
                  value={formDue}
                  onChange={(e) => { setFormDue(e.target.value); if (formError) setFormError(""); }}
                  style={inputStyle}
                />
              </div>
            )}

            {formType === "meeting" && (
              <div style={{ marginTop: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#202124", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formRepeat}
                    onChange={(e) => { setFormRepeat(e.target.checked); if (formError) setFormError(""); }}
                    style={{ width: 16, height: 16 }}
                  />
                  Repeat this meeting
                </label>
                {formRepeat && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Repeats</div>
                      <select
                        value={formRepeatFreq}
                        onChange={(e) => setFormRepeatFreq(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Until</div>
                      <input
                        type="date"
                        value={formRepeatUntil}
                        onChange={(e) => { setFormRepeatUntil(e.target.value); if (formError) setFormError(""); }}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ fontSize: 11, color: "#70757a", margin: "10px 0 6px" }}>Time (optional)</div>
            <input
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              placeholder="2:00 PM"
              style={inputStyle}
            />

            <div style={{ fontSize: 11, color: "#70757a", margin: "10px 0 6px" }}>Notes (optional)</div>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Anything worth flagging"
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
            />

            {formError && (
              <div style={{ fontSize: 12, color: "#c5221f", marginTop: 8 }}>{formError}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid #dadce0", background: "#fff", color: "#5f6368", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={saving}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                  background: formType === "task" ? headInfo(formHead).color : formType === "event" ? EVENT_COLOR : MEETING_COLOR,
                  color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && canManageOwn && (
        <div style={{ position: "sticky", bottom: 58, left: 0, right: 0, display: "flex", gap: 6, padding: "10px 12px", background: "#fff", borderTop: "1px solid #e8eaed", zIndex: 4 }}>
          <button
            onClick={() => openForm("task")}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#1a73e8", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + Task
          </button>
          <button
            onClick={() => openForm("meeting")}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: MEETING_COLOR, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + Meeting
          </button>
          <button
            onClick={() => openForm("event")}
            style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: EVENT_COLOR, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + Event
          </button>
        </div>
      )}
      </>
      )}

      {activeScreen === "analytics" && (
        <AnalyticsScreen currentUser={currentUser} isOwner={isOwner} isHead={isHead} showToast={showToast} />
      )}

      {activeScreen === "academics" && (
        <AcademicsScreen currentUser={currentUser} isOwner={isOwner} isHead={isHead} showToast={showToast} />
      )}

      {activeScreen === "chat" && (
        <ChatScreen currentUser={currentUser} isOwner={isOwner} unreadByRoom={unreadByRoom} markRoomRead={markRoomRead} />
      )}

      {toast && (
        <div style={{
          position: "sticky", bottom: (activeScreen === "planner" && canManageOwn && !showForm) ? 126 : 58, left: 0, right: 0,
          margin: "0 16px", display: "flex", justifyContent: "center", pointerEvents: "none",
        }}>
          <div style={{
            background: "#202124", color: "#fff", fontSize: 12.5, fontWeight: 500,
            padding: "8px 16px", borderRadius: 999, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            {toast}
          </div>
        </div>
      )}

      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0, display: "flex",
        background: "#fff", borderTop: "1px solid #e8eaed", zIndex: 5,
      }}>
        {[
          { id: "planner", label: "Planner", icon: "📅" },
          { id: "analytics", label: "Analytics", icon: "📊" },
          { id: "academics", label: "Academics", icon: "🎓" },
          { id: "chat", label: "Chat", icon: "💬" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id)}
            style={{
              flex: 1, padding: "10px 0 8px", border: "none", background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer",
              color: activeScreen === tab.id ? "#1a73e8" : "#5f6368",
            }}
          >
            <span style={{ fontSize: 17 }}>{tab.icon}</span>
            <span style={{ fontSize: 10.5, fontWeight: activeScreen === tab.id ? 700 : 500 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color, onClick, active }) {
  const clickable = typeof onClick === "function";
  const Tag = clickable ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      style={{
        background: active ? "#E8F0FE" : "#f8f9fa",
        border: active ? "1.5px solid #1a73e8" : "1.5px solid transparent",
        borderRadius: 10, padding: "8px 6px", textAlign: "center",
        cursor: clickable ? "pointer" : "default",
        width: "100%", fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#70757a", marginTop: 1 }}>{label}</div>
    </Tag>
  );
}

function FilterChip({ label, active, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${color}` : "1px solid #dadce0",
        background: active ? bg : "#fff",
        color: active ? color : "#5f6368",
        fontSize: 11.5, fontWeight: 600, padding: active ? "3px 9px" : "4px 10px",
        borderRadius: 999, cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// Simple scrollable feed: overdue tasks first (if any), then everything from today
// onward sorted by date. Respects whatever filters are active on the calendar view.
// ============================================================
// AnalyticsScreen — department performance, enrollment trends,
// faculty overview. Reads from `entries` (existing tasks),
// `enrollment_snapshots`, and `faculty` (new tables).
// ============================================================
function AnalyticsScreen({ currentUser, isOwner, isHead, showToast }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollDept, setEnrollDept] = useState(DEPARTMENTS[0]?.name || "");
  const [enrollCount, setEnrollCount] = useState("");
  const [enrollDate, setEnrollDate] = useState(() => toKey(new Date()));
  const [enrollSaving, setEnrollSaving] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const canManage = isOwner || isHead;
  const myDepts = visibleDeptsFor(currentUser); // what THIS person is allowed to see here

  const fetchAll = useCallback(async () => {
    const [entriesRes, snapshotsRes, facultyRes] = await Promise.all([
      supabase.from("entries").select("*").eq("type", "task"),
      supabase.from("enrollment_snapshots").select("*").order("recorded_date", { ascending: true }),
      supabase.from("faculty").select("*").order("name", { ascending: true }),
    ]);
    if (entriesRes.error) console.error("Analytics tasks fetch error:", entriesRes.error);
    if (snapshotsRes.error) console.error("Enrollment fetch error:", snapshotsRes.error);
    if (facultyRes.error) console.error("Faculty fetch error:", facultyRes.error);
    setTasks(entriesRes.data || []);
    setSnapshots(snapshotsRes.data || []);
    setFacultyList(facultyRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("analytics-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollment_snapshots" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "faculty" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  // ---- KPI row (scoped to visible departments only) ----
  const myDeptNames = myDepts.map((d) => d.name);
  const scopedTasks = tasks.filter((t) => {
    const h = HEADS.find((x) => x.id === t.head);
    return h && myDeptNames.includes(h.programme);
  });
  const scopedFaculty = facultyList.filter((f) => myDeptNames.includes(f.department));
  const totalTasks = scopedTasks.length;
  const completedTasks = scopedTasks.filter((t) => t.status === "completed").length;
  const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalFaculty = scopedFaculty.length;

  // ---- Department task completion (bar) — only their visible departments ----
  const deptStats = myDepts.map((d) => {
    const deptTasks = tasks.filter((t) => {
      const h = HEADS.find((x) => x.id === t.head);
      return h && h.programme === d.name;
    });
    const done = deptTasks.filter((t) => t.status === "completed").length;
    const rate = deptTasks.length > 0 ? Math.round((done / deptTasks.length) * 100) : 0;
    return { ...d, total: deptTasks.length, done, rate };
  });

  // ---- Enrollment trend (line-ish, latest per department) ----
  const latestByDept = {};
  for (const s of snapshots) {
    if (!myDeptNames.includes(s.department)) continue; // only their visible departments
    if (!latestByDept[s.department] || s.recorded_date > latestByDept[s.department].recorded_date) {
      latestByDept[s.department] = s;
    }
  }
  const totalStudents = Object.values(latestByDept).reduce((sum, s) => sum + (s.student_count || 0), 0);

  // ---- Faculty per department (bar) — only their visible departments ----
  const facultyByDept = myDepts.map((d) => ({
    ...d,
    count: facultyList.filter((f) => f.department === d.name).length,
  }));

  async function submitEnrollment() {
    setEnrollError("");
    if (!enrollCount || Number(enrollCount) < 0) {
      setEnrollError("Enter a valid student count.");
      return;
    }
    setEnrollSaving(true);
    const { error } = await supabase.from("enrollment_snapshots").insert({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      department: enrollDept,
      student_count: Number(enrollCount),
      recorded_date: enrollDate,
      entered_by: currentUser?.id || null,
    });
    setEnrollSaving(false);
    if (error) {
      console.error("Enrollment insert error:", error);
      setEnrollError("Couldn't save. Try again.");
      return;
    }
    setShowEnrollForm(false);
    setEnrollCount("");
    showToast("Enrollment recorded");
    fetchAll();
  }

  if (loading) {
    return <div style={{ padding: "24px 16px", fontSize: 13, color: "#70757a" }}>Loading analytics…</div>;
  }

  return (
    <div style={{ padding: "8px 16px 12px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124", margin: "8px 0 12px" }}>Analytics</h2>

      {/* KPI snapshot row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, marginBottom: 20 }}>
        <SummaryStat label="Students" value={totalStudents} color="#202124" />
        <SummaryStat label="Task rate" value={`${overallRate}%`} color="#188038" />
        <SummaryStat label="Faculty" value={totalFaculty} color="#1a73e8" />
        <SummaryStat label="Depts" value={myDepts.length} color="#8430CE" />
      </div>

      {/* Section 1: Department Performance */}
      <SectionHeading title="Department performance" subtitle="Task completion rate by department" />
      <BarChartBlock
        data={deptStats.map((d) => ({ label: d.name, value: d.rate, color: d.color, suffix: "%" }))}
        maxValue={100}
      />

      {/* Section 2: Enrollment Trends */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
        <SectionHeading title="Enrollment" subtitle="Latest recorded students per department" noMargin />
        {canManage && (
          <button
            onClick={() => { setShowEnrollForm((v) => !v); setEnrollError(""); }}
            style={{ border: "none", background: "#E8F0FE", color: "#1a73e8", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, cursor: "pointer" }}
          >
            {showEnrollForm ? "Cancel" : "+ Record"}
          </button>
        )}
      </div>

      {showEnrollForm && (
        <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 12, marginTop: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Department</div>
          <select value={enrollDept} onChange={(e) => setEnrollDept(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }}>
            {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Student count</div>
              <input type="number" min="0" value={enrollCount} onChange={(e) => setEnrollCount(e.target.value)} placeholder="e.g. 45" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Date</div>
              <input type="date" value={enrollDate} onChange={(e) => setEnrollDate(e.target.value)} style={inputStyle} />
            </div>
          </div>
          {enrollError && <div style={{ fontSize: 12, color: "#c5221f", marginTop: 8 }}>{enrollError}</div>}
          <button
            onClick={submitEnrollment}
            disabled={enrollSaving}
            style={{ width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 8, border: "none", background: "#1a73e8", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: enrollSaving ? "default" : "pointer", opacity: enrollSaving ? 0.7 : 1 }}
          >
            {enrollSaving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {Object.keys(latestByDept).length === 0 ? (
        <div style={{ fontSize: 12.5, color: "#70757a", padding: "8px 0" }}>No enrollment data recorded yet.</div>
      ) : (
        <BarChartBlock
          data={myDepts.map((d) => ({
            label: d.name,
            value: latestByDept[d.name]?.student_count || 0,
            color: d.color,
            suffix: "",
          }))}
          maxValue={Math.max(1, ...Object.values(latestByDept).map((s) => s.student_count))}
        />
      )}

      {snapshots.length > 0 && (
        <EnrollmentTrendLine snapshots={snapshots} depts={myDepts} />
      )}

      {/* Section 3: Faculty Overview */}
      <SectionHeading title="Faculty overview" subtitle="Instructor count by department" />
      <BarChartBlock
        data={facultyByDept.map((d) => ({ label: d.name, value: d.count, color: d.color, suffix: "" }))}
        maxValue={Math.max(1, ...facultyByDept.map((d) => d.count))}
      />
    </div>
  );
}

function SectionHeading({ title, subtitle, noMargin }) {
  return (
    <div style={{ marginTop: noMargin ? 0 : 4, marginBottom: 10 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#202124" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: "#70757a", marginTop: 1 }}>{subtitle}</div>}
    </div>
  );
}

// Simple horizontal bar chart — each row is a labeled bar, width proportional
// to value/maxValue. Deliberately simple (no chart library) since the data
// is small (4 departments) and this keeps the bundle light.
function BarChartBlock({ data, maxValue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
            <span style={{ fontWeight: 600, color: "#202124" }}>{d.label}</span>
            <span style={{ color: "#5f6368" }}>{d.value}{d.suffix}</span>
          </div>
          <div style={{ height: 8, background: "#f1f3f4", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${maxValue > 0 ? Math.min(100, (d.value / maxValue) * 100) : 0}%`,
              background: d.color, borderRadius: 999, transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Lightweight SVG line chart showing enrollment over time, one line per
// department, using plain SVG (no chart library) since the data volume is
// small and this avoids adding a dependency for a handful of points.
function EnrollmentTrendLine({ snapshots, depts }) {
  const width = 300;
  const height = 120;
  const padding = 24;

  const deptNames = depts.map((d) => d.name);
  const scopedSnapshots = snapshots.filter((s) => deptNames.includes(s.department));

  const dates = [...new Set(scopedSnapshots.map((s) => s.recorded_date))].sort();
  if (dates.length < 2) {
    return (
      <div style={{ fontSize: 11.5, color: "#70757a", marginTop: 10 }}>
        Record at least 2 dates per department to see a trend line.
      </div>
    );
  }

  const maxCount = Math.max(1, ...scopedSnapshots.map((s) => s.student_count));
  const xFor = (date) => {
    const idx = dates.indexOf(date);
    return padding + (idx / (dates.length - 1)) * (width - padding * 2);
  };
  const yFor = (count) => height - padding - (count / maxCount) * (height - padding * 2);

  return (
    <div style={{ marginTop: 12 }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#dadce0" strokeWidth="1" />
        {depts.map((d) => {
          const points = scopedSnapshots
            .filter((s) => s.department === d.name)
            .sort((a, b) => a.recorded_date.localeCompare(b.recorded_date));
          if (points.length < 2) return null;
          const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.recorded_date)} ${yFor(p.student_count)}`).join(" ");
          return (
            <g key={d.name}>
              <path d={pathD} fill="none" stroke={d.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={i} cx={xFor(p.recorded_date)} cy={yFor(p.student_count)} r="2.5" fill={d.color} />
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        {depts.map((d) => (
          <span key={d.name} style={{ fontSize: 10, color: "#5f6368", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, display: "inline-block" }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AcademicsScreen — class schedule, faculty directory, and
// auto-ranked instructor performance per department.
// ============================================================
// Weekly timetable grid: hourly rows down the side, 7 day columns across the
// top, classes placed in the row matching their start_time's hour. Colored
// by department to stay consistent with the rest of the app.
const TIMETABLE_HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am - 8pm

function WeekTimetable({ classes, weekStart, onPrevWeek, onNextWeek, onToday }) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const todayKeyVal = toKey(new Date());

  function classesFor(dateKey, hour) {
    return classes.filter((c) => {
      if (c.class_date !== dateKey) return false;
      if (!c.start_time) return hour === TIMETABLE_HOURS[0]; // no time set — show in first slot rather than hide it
      const classHour = parseInt(c.start_time.split(":")[0], 10);
      return classHour === hour;
    });
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const rangeLabel = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button onClick={onPrevWeek} aria-label="Previous week" style={navBtnStyle}>‹</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#202124" }}>{rangeLabel}</div>
          <button onClick={onToday} style={{ border: "none", background: "transparent", color: "#1a73e8", fontSize: 10.5, fontWeight: 600, cursor: "pointer", padding: 0 }}>Today</button>
        </div>
        <button onClick={onNextWeek} aria-label="Next week" style={navBtnStyle}>›</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px repeat(7, minmax(74px, 1fr))", minWidth: 560 }}>
          <div />
          {days.map((d, i) => {
            const key = toKey(d);
            const isToday = key === todayKeyVal;
            return (
              <div key={i} style={{ textAlign: "center", padding: "4px 2px", borderBottom: "1px solid #e8eaed" }}>
                <div style={{ fontSize: 9.5, color: "#70757a", fontWeight: 600 }}>{dayNames[i]}</div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: isToday ? "#fff" : "#202124",
                  background: isToday ? "#1a73e8" : "transparent", borderRadius: 999,
                  width: 22, height: 22, lineHeight: "22px", margin: "2px auto 0",
                }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}

          {TIMETABLE_HOURS.map((hour) => (
            <Fragment key={hour}>
              <div style={{ fontSize: 9.5, color: "#9aa0a6", padding: "4px 2px 0 0", textAlign: "right", borderTop: "1px solid #f1f3f4" }}>
                {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? "am" : "pm"}
              </div>
              {days.map((d, i) => {
                const key = toKey(d);
                const cellClasses = classesFor(key, hour);
                return (
                  <div key={i} style={{ borderTop: "1px solid #f1f3f4", borderLeft: "1px solid #f1f3f4", minHeight: 30, padding: 2 }}>
                    {cellClasses.map((c) => {
                      const d2 = deptInfo(c.department);
                      return (
                        <div key={c.id} title={`${c.subject} · ${c.faculty_name || "Unassigned"}`} style={{
                          background: d2.color, color: "#fff", borderRadius: 4, padding: "2px 4px",
                          fontSize: 8.5, fontWeight: 600, marginBottom: 2, lineHeight: 1.2,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {c.subject}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Month timetable: reuses the same day-grid pattern as the Planner calendar,
// showing a colored dot per class that day; tap a day to see its classes below.
function MonthTimetable({ classes, monthCursor, onPrevMonth, onNextMonth, selectedDay, onSelectDay }) {
  const { year, month } = monthCursor;
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKeyVal = toKey(new Date());
  const byDate = {};
  for (const c of classes) {
    if (!byDate[c.class_date]) byDate[c.class_date] = [];
    byDate[c.class_date].push(c);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button onClick={onPrevMonth} aria-label="Previous month" style={navBtnStyle}>‹</button>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>{MONTH_NAMES[month]} {year}</div>
        <button onClick={onNextMonth} aria-label="Next month" style={navBtnStyle}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {dayNames.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 9.5, fontWeight: 600, color: "#70757a", padding: "2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const key = toKey(date);
          const dayClasses = byDate[key] || [];
          const isToday = key === todayKeyVal;
          const isSelected = key === selectedDay;
          return (
            <button
              key={idx}
              onClick={() => onSelectDay(key)}
              style={{
                border: "none", background: isSelected ? "#1a73e8" : isToday ? "#e8f0fe" : "transparent",
                borderRadius: 8, padding: "5px 2px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minHeight: 38,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? "#fff" : isToday ? "#1a73e8" : "#202124" }}>
                {date.getDate()}
              </span>
              <div style={{ display: "flex", gap: 1.5 }}>
                {dayClasses.slice(0, 3).map((c, i) => (
                  <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? "#fff" : deptInfo(c.department).color }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// ChatScreen — a room switcher (General + department rooms this
// person has access to) and a simple realtime text chat per room.
// ============================================================
// ============================================================
// OnlineStatusPanel — owner-only view showing who's currently online
// (checked in within the last 60 seconds) and everyone's last login time.
// ============================================================
function OnlineStatusPanel({ onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const fetchProfiles = useCallback(async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) console.error("Profiles fetch error:", error);
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
    // Refresh the profile data every 15s, and re-check the online threshold
    // every 5s (much cheaper — just re-evaluates timestamps already in hand).
    const dataInterval = setInterval(fetchProfiles, 15000);
    const clockInterval = setInterval(() => setNow(Date.now()), 5000);
    return () => { clearInterval(dataInterval); clearInterval(clockInterval); };
  }, [fetchProfiles]);

  const ONLINE_WINDOW_MS = 60 * 1000;

  // Join profiles (which only exist for people who've actually signed up)
  // against the full PEOPLE roster, so someone who hasn't signed up yet
  // still shows in the list as "Never logged in" rather than being missing.
  // Three states: online now (green), recent/offline but has logged in before
  // (amber, shows last-seen time), never logged in at all (gray).
  const merged = PEOPLE.map((p) => {
    const row = rows.find((r) => r.person_id === p.id);
    const isOnline = row?.last_seen && (now - new Date(row.last_seen).getTime()) < ONLINE_WINDOW_MS;
    const hasEverLoggedIn = !!(row?.last_login || row?.last_seen);
    const status = isOnline ? "online" : hasEverLoggedIn ? "recent" : "never";
    // Prefer last_seen for "how recently active" (updates every 30s while open),
    // fall back to last_login if last_seen is somehow missing.
    const lastActivity = row?.last_seen || row?.last_login || null;
    return { ...p, lastActivity, status };
  }).sort((a, b) => {
    const order = { online: 0, recent: 1, never: 2 };
    return order[a.status] - order[b.status] || a.name.localeCompare(b.name);
  });

  function fmtLoginTime(iso) {
    if (!iso) return "Never logged in";
    const d = new Date(iso);
    const diffMs = now - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  const statusDotColor = { online: "#188038", recent: "#E8A317", never: "#dadce0" };
  const statusLabel = { online: "Online now", recent: null, never: "Never logged in" }; // "recent" uses fmtLoginTime instead

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", width: "100%", maxWidth: 420, maxHeight: "80vh",
        borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e8eaed" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>Online status</div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 18, cursor: "pointer", padding: 4, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0" }}>
          {loading ? (
            <div style={{ fontSize: 13, color: "#70757a", padding: "16px", textAlign: "center" }}>Loading…</div>
          ) : (
            merged.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px" }}>
                <span style={{
                  width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                  background: statusDotColor[p.status],
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#202124" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#70757a" }}>
                    {statusLabel[p.status] || fmtLoginTime(p.lastActivity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ currentUser, isOwner, unreadByRoom, markRoomRead }) {
  const myRooms = roomsFor(currentUser);
  const [activeRoom, setActiveRoom] = useState(myRooms[0]?.id || "general");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const scrollRef = useRef(null);

  const fetchMessages = useCallback(async (roomId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room", roomId)
      .order("created_at", { ascending: true })
      .limit(200); // most recent 200 in this room — plenty for a team of 16
    if (error) console.error("Chat fetch error:", error);
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages(activeRoom);
    markRoomRead(activeRoom); // opening a room (including on initial load) clears its unread badge
    const channel = supabase
      .channel(`chat-${activeRoom}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `room=eq.${activeRoom}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        markRoomRead(activeRoom); // person is actively looking at this room, so it's read as it arrives
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages", filter: `room=eq.${activeRoom}` }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // markRoomRead intentionally omitted from deps: it's a plain (non-memoized)
    // function from the parent, and including it would re-subscribe on every
    // parent render for no reason — we only want this effect to re-run when
    // the room itself changes.
  }, [activeRoom, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const text = draft.trim();
    if (!text || !currentUser) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      room: activeRoom,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      message: text,
    });
    setSending(false);
    if (error) {
      console.error("Send message error:", error);
      return;
    }
    setDraft("");
    // No local optimistic push needed — the realtime INSERT subscription
    // above will deliver it back to us (and everyone else) in a moment.
  }

  async function deleteMessage(id) {
    // Only the original sender can delete their own message — enforced here
    // in the UI (the delete button only shows for your own messages) and
    // it's also a no-op if somehow called on someone else's, since we always
    // pass the id of a message already confirmed to be currentUser's.
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) {
      console.error("Delete message error:", error);
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  // Turns plain URLs in a message into clickable links, since sharing
  // meeting links is one of the main things this chat is for.
  function renderMessageText(text) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, i) =>
      /^https?:\/\//.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "#1a73e8", wordBreak: "break-all" }}>
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  function fmtMsgTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  const room = CHAT_ROOMS.find((r) => r.id === activeRoom);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)", minHeight: 360 }}>
      <div style={{ padding: "8px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124", margin: "8px 0 10px" }}>Chat</h2>
          {isOwner && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu((v) => !v)}
                aria-label="Chat options"
                style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 18, cursor: "pointer", padding: 6, lineHeight: 1 }}
              >
                ⋮
              </button>
              {showMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "100%", background: "#fff", border: "1px solid #dadce0",
                  borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", zIndex: 10, minWidth: 160,
                }}>
                  <button
                    onClick={() => { setShowMenu(false); setShowStatusPanel(true); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                      border: "none", background: "transparent", fontSize: 12.5, color: "#202124", cursor: "pointer",
                    }}
                  >
                    🟢 Online status
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {myRooms.map((r) => {
            const unread = unreadByRoom[r.id] || 0;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRoom(r.id)}
                style={{
                  position: "relative",
                  border: activeRoom === r.id ? `2px solid ${r.color}` : "1px solid #dadce0",
                  background: activeRoom === r.id ? r.bg : "#fff",
                  color: activeRoom === r.id ? r.color : "#5f6368",
                  fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, cursor: "pointer",
                }}
              >
                {r.name}
                {unread > 0 && r.id !== activeRoom && (
                  <span style={{
                    position: "absolute", top: -5, right: -5, background: "#C5221F", color: "#fff",
                    fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 999,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
                    border: "1.5px solid #fff",
                  }}>
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showStatusPanel && (
        <OnlineStatusPanel onClose={() => setShowStatusPanel(false)} />
      )}

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "4px 16px" }}>
        {loading ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "20px 0", textAlign: "center" }}>Loading messages…</div>
        ) : messages.length === 0 ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "20px 0", textAlign: "center" }}>
            No messages yet in {room?.name}. Say hello 👋
          </div>
        ) : (
          messages.map((m) => {
            const isMine = currentUser && m.sender_id === currentUser.id;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                {!isMine && <div style={{ fontSize: 10.5, fontWeight: 600, color: "#5f6368", marginBottom: 2, marginLeft: 4 }}>{m.sender_name}</div>}
                <div style={{
                  maxWidth: "78%", padding: "7px 11px", borderRadius: 14,
                  background: isMine ? "#1a73e8" : "#f1f3f4",
                  color: isMine ? "#fff" : "#202124",
                  fontSize: 13, lineHeight: 1.4, wordBreak: "break-word",
                  borderBottomRightRadius: isMine ? 4 : 14,
                  borderBottomLeftRadius: isMine ? 14 : 4,
                }}>
                  {renderMessageText(m.message)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, marginRight: isMine ? 4 : 0, marginLeft: isMine ? 0 : 4 }}>
                  <span style={{ fontSize: 9.5, color: "#9aa0a6" }}>{fmtMsgTime(m.created_at)}</span>
                  {isMine && (
                    <button
                      onClick={() => deleteMessage(m.id)}
                      style={{ border: "none", background: "transparent", color: "#c5221f", fontSize: 9.5, fontWeight: 600, cursor: "pointer", padding: 0 }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 16px", borderTop: "1px solid #e8eaed", background: "#fff" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !sending) sendMessage(); }}
          placeholder={`Message ${room?.name || ""}…`}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !draft.trim()}
          style={{
            border: "none", background: "#1a73e8", color: "#fff", borderRadius: 8, padding: "0 16px",
            fontSize: 13, fontWeight: 600, cursor: sending || !draft.trim() ? "default" : "pointer",
            opacity: sending || !draft.trim() ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function AcademicsScreen({ currentUser, isOwner, isHead, showToast }) {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [scheduleView, setScheduleView] = useState("week"); // "week" | "month" | "list"
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [monthCursor, setMonthCursor] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [selectedDay, setSelectedDay] = useState(() => toKey(new Date()));
  const [showClassForm, setShowClassForm] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);

  const [classDept, setClassDept] = useState(DEPARTMENTS[0]?.name || "");
  const [classSubject, setClassSubject] = useState("");
  const [classFacultyId, setClassFacultyId] = useState("");
  const [classDate, setClassDate] = useState(() => toKey(new Date()));
  const [classTime, setClassTime] = useState("");
  const [classNotes, setClassNotes] = useState("");
  const [classError, setClassError] = useState("");
  const [showQuickFaculty, setShowQuickFaculty] = useState(false);
  const [quickFacName, setQuickFacName] = useState("");
  const [quickFacSubject, setQuickFacSubject] = useState("");
  const [quickFacError, setQuickFacError] = useState("");
  const [quickFacSaving, setQuickFacSaving] = useState(false);
  const [classSaving, setClassSaving] = useState(false);

  const [facName, setFacName] = useState("");
  const [facDept, setFacDept] = useState(DEPARTMENTS[0]?.name || "");
  const [facSubject, setFacSubject] = useState("");
  const [facError, setFacError] = useState("");
  const [facSaving, setFacSaving] = useState(false);

  // Only owners can manage every department; heads can only manage their own
  // department's classes and faculty, matching the same pattern as tasks.
  const myDept = currentUser?.programme || null;
  function canManageDept(deptName) {
    if (isOwner) return true;
    if (isHead) return deptName === myDept;
    return false;
  }

  // What this person is even allowed to SEE here — owners/heads see all 4,
  // members see only their assigned department(s).
  const myDepts = visibleDeptsFor(currentUser);
  const myDeptNames = myDepts.map((d) => d.name);

  const fetchAll = useCallback(async () => {
    const [classesRes, facultyRes] = await Promise.all([
      supabase.from("class_sessions").select("*").order("class_date", { ascending: true }),
      supabase.from("faculty").select("*").order("name", { ascending: true }),
    ]);
    if (classesRes.error) console.error("Classes fetch error:", classesRes.error);
    if (facultyRes.error) console.error("Faculty fetch error:", facultyRes.error);
    setClasses(classesRes.data || []);
    setFacultyList(facultyRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("academics-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "class_sessions" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "faculty" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  useEffect(() => {
    if (isHead && myDept) {
      setClassDept(myDept);
      setFacDept(myDept);
    }
  }, [isHead, myDept]);

  // Scoped down to only what this person can see — everything below reads
  // from these, never the raw `classes`/`facultyList` state directly.
  const visibleClasses = classes.filter((c) => myDeptNames.includes(c.department));
  const visibleFaculty = facultyList.filter((f) => myDeptNames.includes(f.department));

  const filteredClasses = visibleClasses.filter((c) => {
    if (deptFilter !== "all" && c.department !== deptFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const activeFilterCount = (deptFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const activeFilterLabel = activeFilterCount > 0 ? `Filters (${activeFilterCount} active)` : "Filters";

  const facultyForClassDept = facultyList.filter((f) => f.department === classDept);

  // Instructor performance: completion rate = completed sessions / total
  // sessions scheduled for them, ranked highest-first, within each department
  // this person can see.
  const performanceByDept = myDepts.map((d) => {
    const deptFaculty = visibleFaculty.filter((f) => f.department === d.name);
    const ranked = deptFaculty
      .map((f) => {
        const theirClasses = visibleClasses.filter((c) => c.faculty_id === f.id);
        const completed = theirClasses.filter((c) => c.status === "completed").length;
        const rate = theirClasses.length > 0 ? Math.round((completed / theirClasses.length) * 100) : null;
        return { ...f, total: theirClasses.length, completed, rate };
      })
      .filter((f) => f.total > 0)
      .sort((a, b) => b.rate - a.rate || b.total - a.total);
    return { ...d, ranked };
  });

  async function submitClass() {
    setClassError("");
    if (!classSubject.trim()) { setClassError("Enter a subject."); return; }
    if (!classDate) { setClassError("Pick a date."); return; }
    if (!classTime) { setClassError("Pick a start time."); return; }
    if (!canManageDept(classDept)) { setClassError("You can only add classes for your own department."); return; }
    setClassSaving(true);
    const facultyMember = facultyList.find((f) => f.id === classFacultyId);
    const { error } = await supabase.from("class_sessions").insert({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      department: classDept,
      subject: classSubject.trim(),
      faculty_id: classFacultyId || null,
      faculty_name: facultyMember ? facultyMember.name : null,
      class_date: classDate,
      start_time: classTime, // "HH:MM" from the time input
      status: "scheduled",
      notes: classNotes.trim(),
    });
    setClassSaving(false);
    if (error) {
      console.error("Class insert error:", error);
      setClassError("Couldn't save. Try again.");
      return;
    }
    setShowClassForm(false);
    setClassSubject(""); setClassFacultyId(""); setClassTime(""); setClassNotes("");
    showToast("Class scheduled");
    fetchAll();
  }

  async function cycleClassStatus(cls) {
    if (!canManageDept(cls.department)) return;
    const order = ["scheduled", "completed", "cancelled"];
    const next = order[(order.indexOf(cls.status) + 1) % order.length];
    const { error } = await supabase.from("class_sessions").update({ status: next }).eq("id", cls.id);
    if (error) { console.error("Class status update error:", error); return; }
    showToast(`Class marked ${next}`);
    fetchAll();
  }

  async function deleteClass(cls) {
    if (!canManageDept(cls.department)) return;
    const { error } = await supabase.from("class_sessions").delete().eq("id", cls.id);
    if (error) { console.error("Class delete error:", error); return; }
    showToast("Class removed");
    fetchAll();
  }

  async function submitFaculty() {
    setFacError("");
    if (!facName.trim()) { setFacError("Enter a name."); return; }
    if (!canManageDept(facDept)) { setFacError("You can only add faculty for your own department."); return; }
    setFacSaving(true);
    const { error } = await supabase.from("faculty").insert({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: facName.trim(),
      department: facDept,
      subject: facSubject.trim(),
    });
    setFacSaving(false);
    if (error) {
      console.error("Faculty insert error:", error);
      setFacError("Couldn't save. Try again.");
      return;
    }
    setShowFacultyForm(false);
    setFacName(""); setFacSubject("");
    showToast("Faculty added");
    fetchAll();
  }

  // Same as submitFaculty, but used from inside the class form: adds the
  // faculty member AND immediately selects them for the class being created,
  // so the person doesn't have to cancel out, add faculty separately, then
  // start the class form over from scratch.
  async function submitQuickFaculty() {
    setQuickFacError("");
    if (!quickFacName.trim()) { setQuickFacError("Enter a name."); return; }
    if (!canManageDept(classDept)) { setQuickFacError("You can only add faculty for your own department."); return; }
    setQuickFacSaving(true);
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { error } = await supabase.from("faculty").insert({
      id: newId,
      name: quickFacName.trim(),
      department: classDept,
      subject: quickFacSubject.trim(),
    });
    setQuickFacSaving(false);
    if (error) {
      console.error("Quick faculty insert error:", error);
      setQuickFacError("Couldn't save. Try again.");
      return;
    }
    setShowQuickFaculty(false);
    setQuickFacName(""); setQuickFacSubject("");
    showToast(`${quickFacName.trim()} added`);
    await fetchAll(); // make sure facultyList (and its <option>) exists before selecting it
    setClassFacultyId(newId);
  }

  async function deleteFaculty(f) {
    if (!canManageDept(f.department)) return;
    const { error } = await supabase.from("faculty").delete().eq("id", f.id);
    if (error) { console.error("Faculty delete error:", error); return; }
    showToast("Faculty removed");
    fetchAll();
  }

  if (loading) {
    return <div style={{ padding: "24px 16px", fontSize: 13, color: "#70757a" }}>Loading academics…</div>;
  }

  const classStatusInfo = {
    scheduled: { label: "Scheduled", color: "#1a73e8", bg: "#E8F0FE" },
    completed: { label: "Completed", color: "#188038", bg: "#E6F4EA" },
    cancelled: { label: "Cancelled", color: "#5f6368", bg: "#f1f3f4" },
  };

  return (
    <div style={{ padding: "8px 16px 12px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124", margin: "8px 0 12px" }}>Academics</h2>

      {/* Class Schedule */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionHeading title="Class schedule" subtitle="Subject-wise sessions by department" noMargin />
        <button
          onClick={() => { setShowClassForm((v) => !v); setClassError(""); }}
          style={{ border: "none", background: "#E8F0FE", color: "#1a73e8", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, cursor: "pointer" }}
        >
          {showClassForm ? "Cancel" : "+ Class"}
        </button>
      </div>

      {visibleClasses.length > 0 && (
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 11.5, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: showFilters ? 8 : 12, display: "flex", alignItems: "center", gap: 4 }}
        >
          {activeFilterLabel} {showFilters ? "▲" : "▼"}
        </button>
      )}

      {showFilters && visibleClasses.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            <FilterChip label="All depts" active={deptFilter === "all"} color="#5f6368" bg="#f1f3f4" onClick={() => setDeptFilter("all")} />
            {myDepts.map((d) => (
              <FilterChip key={d.name} label={d.name} active={deptFilter === d.name} color={d.color} bg={d.bg} onClick={() => setDeptFilter(d.name)} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <FilterChip label="All" active={statusFilter === "all"} color="#5f6368" bg="#f1f3f4" onClick={() => setStatusFilter("all")} />
            <FilterChip label="Scheduled" active={statusFilter === "scheduled"} color="#1a73e8" bg="#E8F0FE" onClick={() => setStatusFilter("scheduled")} />
            <FilterChip label="Completed" active={statusFilter === "completed"} color="#188038" bg="#E6F4EA" onClick={() => setStatusFilter("completed")} />
            <FilterChip label="Cancelled" active={statusFilter === "cancelled"} color="#5f6368" bg="#f1f3f4" onClick={() => setStatusFilter("cancelled")} />
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[
          { id: "week", label: "Week" },
          { id: "month", label: "Month" },
          { id: "list", label: "List" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setScheduleView(v.id)}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: scheduleView === v.id ? "2px solid #1a73e8" : "1px solid #dadce0",
              background: scheduleView === v.id ? "#E8F0FE" : "#fff",
              color: scheduleView === v.id ? "#1a73e8" : "#5f6368",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {showClassForm && (
        <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Department</div>
          <select
            value={classDept}
            onChange={(e) => { setClassDept(e.target.value); setClassFacultyId(""); }}
            disabled={isHead}
            style={{ ...inputStyle, marginBottom: 8, opacity: isHead ? 0.7 : 1 }}
          >
            {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Subject</div>
          <input value={classSubject} onChange={(e) => setClassSubject(e.target.value)} placeholder="e.g. Contract Law Basics" style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Faculty (optional)</div>
          <select value={classFacultyId} onChange={(e) => setClassFacultyId(e.target.value)} style={{ ...inputStyle, marginBottom: 6 }}>
            <option value="">— Unassigned —</option>
            {facultyForClassDept.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          {!showQuickFaculty ? (
            <button
              onClick={() => setShowQuickFaculty(true)}
              style={{ border: "none", background: "transparent", color: "#1a73e8", fontSize: 11.5, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 8 }}
            >
              + Add new faculty to {classDept}
            </button>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #dadce0", borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <input
                value={quickFacName}
                onChange={(e) => setQuickFacName(e.target.value)}
                placeholder="Faculty name"
                style={{ ...inputStyle, marginBottom: 6 }}
              />
              <input
                value={quickFacSubject}
                onChange={(e) => setQuickFacSubject(e.target.value)}
                placeholder="Subject (optional)"
                style={{ ...inputStyle, marginBottom: 8 }}
              />
              {quickFacError && <div style={{ fontSize: 11.5, color: "#c5221f", marginBottom: 6 }}>{quickFacError}</div>}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => { setShowQuickFaculty(false); setQuickFacName(""); setQuickFacSubject(""); setQuickFacError(""); }}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: "1px solid #dadce0", background: "#fff", color: "#5f6368", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitQuickFaculty}
                  disabled={quickFacSaving}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: "none", background: "#1a73e8", color: "#fff", fontSize: 12, fontWeight: 600, cursor: quickFacSaving ? "default" : "pointer", opacity: quickFacSaving ? 0.7 : 1 }}
                >
                  {quickFacSaving ? "Adding…" : "Add & select"}
                </button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Date</div>
              <input type="date" value={classDate} onChange={(e) => setClassDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Start time</div>
              <input type="time" value={classTime} onChange={(e) => setClassTime(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#70757a", margin: "8px 0 6px" }}>Notes (optional)</div>
          <textarea value={classNotes} onChange={(e) => setClassNotes(e.target.value)} rows={2} style={{ ...inputStyle, resize: "none" }} />
          {classError && <div style={{ fontSize: 12, color: "#c5221f", marginTop: 8 }}>{classError}</div>}
          <button
            onClick={submitClass}
            disabled={classSaving}
            style={{ width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 8, border: "none", background: "#1a73e8", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: classSaving ? "default" : "pointer", opacity: classSaving ? 0.7 : 1 }}
          >
            {classSaving ? "Saving…" : "Save class"}
          </button>
        </div>
      )}

      {scheduleView === "week" && (
        <div style={{ marginBottom: 20 }}>
          <WeekTimetable
            classes={filteredClasses}
            weekStart={weekStart}
            onPrevWeek={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; })}
            onNextWeek={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; })}
            onToday={() => setWeekStart(startOfWeek(new Date()))}
          />
        </div>
      )}

      {scheduleView === "month" && (
        <div style={{ marginBottom: 20 }}>
          <MonthTimetable
            classes={filteredClasses}
            monthCursor={monthCursor}
            onPrevMonth={() => setMonthCursor((m) => (m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }))}
            onNextMonth={() => setMonthCursor((m) => (m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }))}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
          <div style={{ fontSize: 12, fontWeight: 700, color: "#202124", margin: "12px 0 8px" }}>
            {fmtLong(new Date(selectedDay + "T00:00:00"))}
          </div>
          {filteredClasses.filter((c) => c.class_date === selectedDay).length === 0 ? (
            <div style={{ fontSize: 12.5, color: "#70757a" }}>No classes this day.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredClasses.filter((c) => c.class_date === selectedDay).map((c) => {
                const d = deptInfo(c.department);
                const s = classStatusInfo[c.status] || classStatusInfo.scheduled;
                const canEdit = canManageDept(c.department);
                return (
                  <div key={c.id} style={{ background: d.bg, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>{c.subject}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#5f6368", paddingLeft: 13, marginTop: 1 }}>
                        {c.department} · {c.faculty_name || "Unassigned"}{c.start_time ? ` · ${fmtTime(c.start_time)}` : ""}
                      </div>
                      {canEdit ? (
                        <button onClick={() => cycleClassStatus(c)} style={{ marginLeft: 13, marginTop: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 999, color: s.color, background: s.bg }}>
                          {s.label}
                        </button>
                      ) : (
                        <span style={{ display: "inline-block", marginLeft: 13, marginTop: 4, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 999, color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      )}
                    </div>
                    {canEdit && (
                      <button onClick={() => deleteClass(c)} aria-label="Delete" style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 14, cursor: "pointer", padding: 4, lineHeight: 1 }}>×</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {scheduleView === "list" && (
      filteredClasses.length === 0 ? (
        <div style={{ fontSize: 12.5, color: "#70757a", padding: "8px 0 16px" }}>No classes match these filters.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {filteredClasses.map((c) => {
            const d = deptInfo(c.department);
            const s = classStatusInfo[c.status] || classStatusInfo.scheduled;
            const canEdit = canManageDept(c.department);
            return (
              <div key={c.id} style={{ background: d.bg, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#202124" }}>{c.subject}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13, marginTop: 1 }}>
                    {c.department} · {c.faculty_name || "Unassigned"} · {fmtShort(c.class_date)}{c.start_time ? ` · ${fmtTime(c.start_time)}` : ""}
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => cycleClassStatus(c)}
                      style={{ marginLeft: 13, marginTop: 4, border: "none", cursor: "pointer", fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999, color: s.color, background: s.bg }}
                    >
                      {s.label} · tap to change
                    </button>
                  ) : (
                    <span style={{ display: "inline-block", marginLeft: 13, marginTop: 4, fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999, color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  )}
                </div>
                {canEdit && (
                  <button onClick={() => deleteClass(c)} aria-label="Delete" style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 15, cursor: "pointer", padding: 4, lineHeight: 1, flexShrink: 0 }}>×</button>
                )}
              </div>
            );
          })}
        </div>
      )
      )}

      {/* Faculty directory */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionHeading title="Faculty directory" noMargin />
        <button
          onClick={() => { setShowFacultyForm((v) => !v); setFacError(""); }}
          style={{ border: "none", background: "#E8F0FE", color: "#1a73e8", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, cursor: "pointer" }}
        >
          {showFacultyForm ? "Cancel" : "+ Faculty"}
        </button>
      </div>

      {showFacultyForm && (
        <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Name</div>
          <input value={facName} onChange={(e) => setFacName(e.target.value)} placeholder="Full name" style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Department</div>
          <select value={facDept} onChange={(e) => setFacDept(e.target.value)} disabled={isHead} style={{ ...inputStyle, marginBottom: 8, opacity: isHead ? 0.7 : 1 }}>
            {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <div style={{ fontSize: 11, color: "#70757a", marginBottom: 6 }}>Subject (optional)</div>
          <input value={facSubject} onChange={(e) => setFacSubject(e.target.value)} placeholder="e.g. Contract Law" style={inputStyle} />
          {facError && <div style={{ fontSize: 12, color: "#c5221f", marginTop: 8 }}>{facError}</div>}
          <button
            onClick={submitFaculty}
            disabled={facSaving}
            style={{ width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 8, border: "none", background: "#1a73e8", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: facSaving ? "default" : "pointer", opacity: facSaving ? 0.7 : 1 }}
          >
            {facSaving ? "Saving…" : "Save faculty"}
          </button>
        </div>
      )}

      {visibleFaculty.length === 0 ? (
        <div style={{ fontSize: 12.5, color: "#70757a", padding: "8px 0 16px" }}>No faculty added yet.</div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          {myDepts.map((d) => {
            const deptFaculty = visibleFaculty.filter((f) => f.department === d.name);
            if (deptFaculty.length === 0) return null;
            return (
              <div key={d.name} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: d.color, marginBottom: 5 }}>{d.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {deptFaculty.map((f) => {
                    const canEdit = canManageDept(f.department);
                    return (
                      <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: d.bg, borderRadius: 8 }}>
                        <div>
                          <span style={{ fontSize: 12.5, fontWeight: 500, color: "#202124" }}>{f.name}</span>
                          <span style={{ fontSize: 11, color: "#5f6368", marginLeft: 6 }}>{f.subject || "—"}</span>
                        </div>
                        {canEdit && (
                          <button onClick={() => deleteFaculty(f)} aria-label="Delete" style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 14, cursor: "pointer", padding: 4, lineHeight: 1 }}>×</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructor performance */}
      <SectionHeading title="Top instructors" subtitle="Ranked by class completion rate, per department" />
      {performanceByDept.every((d) => d.ranked.length === 0) ? (
        <div style={{ fontSize: 12.5, color: "#70757a", padding: "8px 0" }}>
          No completed classes yet — rankings appear once sessions are marked Completed.
        </div>
      ) : (
        performanceByDept.map((d) => (
          d.ranked.length === 0 ? null : (
            <div key={d.name} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.color, marginBottom: 6 }}>{d.name}</div>
              <div style={{ border: "1px solid #dadce0", borderRadius: 10, overflow: "hidden" }}>
                {d.ranked.map((f, idx) => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderTop: idx === 0 ? "none" : "1px solid #f1f3f4", background: idx === 0 ? "#FFFBEA" : "#fff" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: idx === 0 ? "#B06000" : "#70757a", width: 18 }}>
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                    </span>
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: "#202124" }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: "#70757a" }}>{f.completed}/{f.total}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, minWidth: 36, textAlign: "right", color: f.rate >= 70 ? "#188038" : f.rate >= 40 ? "#B06000" : "#C5221F" }}>
                      {f.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))
      )}
    </div>
  );
}

function ListView({ entries, todayKey, currentUser, isMember, headInfo, canEditEntry, openEditForm, deleteEntry, cycleStatus, isStatFiltered }) {
  const withDate = entries.filter((e) => e.dueDate);
  const overdue = withDate
    .filter((e) => e.type === "task" && e.dueDate < todayKey && e.status !== "completed" && e.status !== "cancelled")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcoming = withDate
    .filter((e) => e.dueDate >= todayKey)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  // When a stat card filter (Completed/In progress/Overdue) is active, every
  // entry already matches that one criterion — showing a separate "Overdue"
  // vs "Upcoming" split on top of that is confusing and can produce an
  // empty/contradictory section. Just render one flat list in that case.
  const allSorted = withDate.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  function Row(e) {
    const isTask = e.type === "task";
    const h = headInfo(e.head);
    const color = e.type === "meeting" ? MEETING_COLOR : e.type === "event" ? EVENT_COLOR : (h ? h.color : "#5f6368");
    const bg = e.type === "meeting" ? MEETING_BG : e.type === "event" ? EVENT_BG : (h ? h.bg : "#f1f3f4");
    const isMyTask = isTask && currentUser && e.assignee === currentUser.name;
    const canChangeStatus = isTask && (canEditEntry(e) || isMyTask);
    const canDelete = canEditEntry(e);
    return (
      <div key={e.id} style={{ background: bg, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#202124", wordBreak: "break-word" }}>{e.title}</span>
            <span style={{ fontSize: 10.5, color: "#5f6368" }}>· {fmtShort(e.dueDate)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: "#5f6368", paddingLeft: 13 }}>
            {isTask ? `${e.assignee || "Unassigned"} · entered by ${h ? h.name : "Unknown"}` : typeLabel(e.type)}
            {e.time ? ` · ${e.time}` : ""}
          </div>
          {isTask && (
            canChangeStatus ? (
              <button
                onClick={() => cycleStatus(e.id)}
                style={{
                  marginLeft: 13, marginTop: 4, border: "none", cursor: "pointer",
                  fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                  color: statusInfo(e.status).color, background: statusInfo(e.status).bg,
                }}
              >
                {statusInfo(e.status).label} · tap to {isMember ? "toggle" : "change"}
              </button>
            ) : (
              <span style={{
                display: "inline-block", marginLeft: 13, marginTop: 4,
                fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                color: statusInfo(e.status).color, background: statusInfo(e.status).bg,
              }}>
                {statusInfo(e.status).label}
              </span>
            )
          )}
        </div>
        {canDelete && (
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            <button onClick={() => openEditForm(e)} aria-label="Edit" style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 13, cursor: "pointer", padding: 4, lineHeight: 1 }}>✏️</button>
            <button onClick={() => deleteEntry(e.id)} aria-label="Delete" style={{ border: "none", background: "transparent", color: "#5f6368", fontSize: 15, cursor: "pointer", padding: 4, lineHeight: 1 }}>×</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "4px 16px 12px" }}>
      {isStatFiltered ? (
        allSorted.length === 0 ? (
          <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0" }}>Nothing here.</div>
        ) : (
          allSorted.map(Row)
        )
      ) : (
        <>
          {overdue.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#C5221F", margin: "4px 0 8px" }}>Overdue</div>
              {overdue.map(Row)}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#202124", margin: "14px 0 8px" }}>Upcoming</div>
            </>
          )}
          {upcoming.length === 0 ? (
            <div style={{ fontSize: 13, color: "#70757a", padding: "8px 0" }}>Nothing upcoming.</div>
          ) : (
            upcoming.map(Row)
          )}
        </>
      )}
    </div>
  );
}

const navBtnStyle = {
  border: "none", background: "#f1f3f4", width: 32, height: 32, borderRadius: "50%",
  fontSize: 18, color: "#5f6368", cursor: "pointer", lineHeight: 1,
};

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 10px", borderRadius: 8,
  border: "1px solid #dadce0", fontSize: 13.5, fontFamily: "inherit", color: "#202124",
};
