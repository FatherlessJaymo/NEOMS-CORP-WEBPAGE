/* ============================================================
   NEOMS — STAFF POSITION SCHEME WINDOW
   Neoms~Database/windows/staff-scheme/staff-scheme.js
   ============================================================ */

const ROLES = [
  {
    dept: "SYNTHETICS",
    positions: [
      {
        title: "Synthetic Unit",
        bio: "The base synthetic humanoid operative assigned to core facility operations. Designated for automated task execution under direct supervision with minimal autonomous decision-making authority. Synthetic Units serve as the primary labour force across non-critical zones and are processed through the Standard Intake Protocol on first registration."
      },
      {
        title: "Synthetic Asset",
        bio: "An advanced synthetic unit with augmented processing capability and adaptive behavioural routines. Assigned to specialised tasks requiring contextual response and limited independent action. Synthetic Assets may be deployed in proximity to low-tier anomalies under a Containment Enforcement escort."
      }
    ]
  },
  {
    dept: "FACILITY UNITS",
    positions: [
      {
        title: "Core Units Personnel",
        bio: "Primary human workforce assigned to daily facility maintenance, logistics, supply management, and operational support across all non-critical zones. Core Units Personnel form the backbone of site functionality and are cleared for movement throughout standard access corridors."
      },
      {
        title: "Sub Units Personnel",
        bio: "Secondary support personnel handling auxiliary tasks, equipment management, and lower-security facility functions. Sub Units Personnel operate under the direction of Core Units Personnel and are restricted to designated sub-zones within the installation."
      }
    ]
  },
  {
    dept: "FACILITY COMMAND",
    positions: [
      {
        title: "Core Command Director",
        bio: "Senior facility administrators responsible for overseeing departmental operations, resource allocation, inter-departmental coordination, and escalation of critical incidents. Core Command Directors maintain authority over all standard facility operations and report directly to the Sub Command tier above."
      },
      {
        title: "Sub Command Director",
        bio: "Mid-tier command personnel managing specific facility sectors or sub-departments under Core Command authority. Sub Command Directors coordinate daily operations across assigned zones and serve as the primary point of contact for inter-departmental issues requiring administrative resolution."
      }
    ]
  },
  {
    dept: "CONTAINMENT ENFORCEMENT",
    positions: [
      {
        title: "Sentinel Senior Officer Forces",
        bio: "Elite containment enforcement officers authorised for direct interaction with high-threat anomalies. Lead breach response teams, coordinate armed suppression operations, and hold authority to escalate containment status. Sentinel Senior Officers are required to maintain active certification in anomaly suppression protocol annually."
      },
      {
        title: "Sentinel Forces",
        bio: "Standard containment enforcement personnel trained in anomaly suppression, perimeter security, and emergency response protocols. Sentinel Forces maintain watch across containment corridors and are the first response unit in the event of a containment breach or security incident."
      }
    ]
  },
  {
    dept: "CONTAINMENT RESEARCH",
    positions: [
      {
        title: "Anomaly Research Specialist",
        bio: "Senior researchers conducting advanced study of anomalous entities and phenomena. Responsible for designing and evaluating containment protocols, producing theoretical frameworks for anomaly classification, and leading multi-analyst research teams. Research Specialists hold elevated access privileges to entity dossiers and experimental containment data."
      },
      {
        title: "Anomaly Research Analyst",
        bio: "Junior research personnel assisting in data collection, protocol documentation, observation logging, and preliminary anomaly assessment. Analysts operate under the direction of a Research Specialist and may access standard entity records relevant to their assigned study area."
      }
    ]
  },
  {
    dept: "PRIME DIRECTOR",
    positions: [
      {
        title: "Directive Control Officer",
        bio: "High-authority personnel with oversight of classified directives, strategic containment policy, and inter-site coordination. Directive Control Officers operate with broad executive authority and report directly to the Overseer Prime. Their designations and assignments are not publicly listed in standard personnel records."
      },
      {
        title: "Overseer Prime",
        bio: "The supreme administrative authority of the NeoMS installation. All facility operations, containment decisions, resource deployment, and personnel matters are subject to Overseer Prime jurisdiction. The Overseer Prime is the sole individual with full CL-5 access privileges by default and coordinates directly with NeoMS Central."
      }
    ]
  }
];

const DEPT_COLORS = {
  "SYNTHETICS":              { border: "#00cc66", color: "#00cc66" },
  "FACILITY UNITS":          { border: "#4488ff", color: "#4488ff" },
  "FACILITY COMMAND":        { border: "#ffaa00", color: "#ffaa00" },
  "CONTAINMENT ENFORCEMENT": { border: "#ff3366", color: "#ff3366" },
  "CONTAINMENT RESEARCH":    { border: "#cc44ff", color: "#cc44ff" },
  "PRIME DIRECTOR":         { border: "#ff6600", color: "#ff6600" }
};

const wrap = document.getElementById("scheme-content");
if (wrap) {
  wrap.innerHTML = ROLES.map(group => {
    const dc = DEPT_COLORS[group.dept] || { border: "#334", color: "#667" };

    const rows = group.positions.map(p => `
      <div class="ss-role-card" style="border-left-color:${dc.border}33;">
        <div class="ss-role-title">${p.title}</div>
        <div class="ss-role-dept" style="color:${dc.color};">${group.dept}</div>
        <div class="ss-role-bio">${p.bio}</div>
      </div>`).join("");

    return `
      <div class="ss-dept-group">
        <div class="ss-dept-header" style="color:${dc.color};border-bottom-color:${dc.border}44;">
          &#9658; ${group.dept}
        </div>
        ${rows}
      </div>`;
  }).join("");
}
