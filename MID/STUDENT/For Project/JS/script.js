let candidates = [
    {
        id: 1,
        name: "Tanvir Hossain",
        role: "React / Node.js Lead",
        shortName: "Tanvir",
        score: 94,
        status: "Shortlisted",
        matchedSkills: ["React", "Node.js", "Express", "MongoDB", "Docker"],
        missingSkills: ["AWS"]
    },
    {
        id: 2,
        name: "Nusrat Jahan",
        role: "Full Stack Dev",
        shortName: "Nusrat",
        score: 88,
        status: "Pending",
        matchedSkills: ["React", "JavaScript", "Python", "PostgreSQL"],
        missingSkills: ["Docker", "GraphQL"]
    },
    {
        id: 3,
        name: "Arafat Rahman",
        role: "Frontend Dev",
        shortName: "Arafat",
        score: 76,
        status: "Pending",
        matchedSkills: ["React", "HTML/CSS", "Tailwind"],
        missingSkills: ["Node.js", "Docker"]
    },
    {
        id: 4,
        name: "Sadia Islam",
        role: "Python / Django Dev",
        shortName: "Sadia",
        score: 62,
        status: "Rejected",
        matchedSkills: ["Python", "Django", "SQL"],
        missingSkills: ["React", "Node.js", "Docker"]
    }
];

let selectedCandidateId = 1;
let currentFilter = "All";

document.addEventListener("DOMContentLoaded", () => {
    renderCandidates();
    renderDetailPanel();
    renderChart();
});

// Switch between Applicants & AI Assistant Tabs
function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Render Candidate Cards List
function renderCandidates() {
    const listContainer = document.getElementById("candidateList");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    let filtered = candidates.filter(c => {
        if (currentFilter === "All") return true;
        return c.status === currentFilter;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 15px; color:#64748b; font-size:13px;">No applicants found for "${currentFilter}" filter.</div>`;
        return;
    }

    filtered.forEach(c => {
        const isSelected = c.id === selectedCandidateId;
        const statusClass = c.status === "Shortlisted" ? "status-shortlisted" :
                            c.status === "Rejected" ? "status-rejected" : "status-pending";

        const card = document.createElement("div");
        card.className = `candidate-card ${isSelected ? 'selected' : ''}`;
        card.onclick = () => selectCandidate(c.id);

        card.innerHTML = `
            <div>
                <div class="cand-name">${c.name}</div>
                <div class="cand-role">${c.role}</div>
            </div>
            <div class="cand-meta">
                <span class="score-badge">${c.score}%</span>
                <span class="status-badge ${statusClass}">${c.status}</span>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Select Candidate to display details
function selectCandidate(id) {
    selectedCandidateId = id;
    renderCandidates();
    renderDetailPanel();
}

// Render Selected Candidate Detail Panel
function renderDetailPanel() {
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    const panel = document.getElementById("detailPanel");
    if (!panel) return;

    if (!candidate) {
        panel.innerHTML = `<div style="text-align:center; color:#64748b; font-size:13px;">Select a candidate to view details</div>`;
        return;
    }

    const matchedHTML = candidate.matchedSkills.map(s => `<span class="tag">${s}</span>`).join("");
    const missingHTML = candidate.missingSkills.map(s => `<span class="tag tag-missing">${s}</span>`).join("");

    panel.innerHTML = `
        <div class="detail-header">
            <div>
                <h3>${candidate.name}</h3>
                <p>${candidate.role} • ${candidate.score}% AI Match Score</p>
            </div>
            <div class="action-btns">
                <button class="btn-action" onclick="updateStatus(${candidate.id}, 'Shortlisted')">Shortlist</button>
                <button class="btn-action" onclick="updateStatus(${candidate.id}, 'Rejected')">Reject</button>
            </div>
        </div>

        <div class="skill-section-title">Matched Skills:</div>
        <div class="tags-container">${matchedHTML}</div>

        <div class="skill-section-title">Missing / Skill Gap:</div>
        <div class="tags-container">${missingHTML}</div>
    `;
}

// Update Candidate Status (Shortlist/Reject)
function updateStatus(id, newStatus) {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
        candidate.status = newStatus;
        renderCandidates();
        renderDetailPanel();
    }
}

// Filter Candidates (All, Shortlisted, Pending, Rejected)
function filterCandidates(status, buttonEl) {
    currentFilter = status;
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    buttonEl.classList.add('active');
    renderCandidates();
}

// Sort Applicants by Score
function sortCandidates() {
    const sortVal = document.getElementById("sortSelect").value;
    if (sortVal === "highToLow") {
        candidates.sort((a, b) => b.score - a.score);
    } else if (sortVal === "lowToHigh") {
        candidates.sort((a, b) => a.score - b.score);
    }
    renderCandidates();
    renderChart();
}

// Render Dynamic Score Chart
function renderChart() {
    const chartBars = document.getElementById("chartBars");
    const xAxis = document.getElementById("xAxis");
    if (!chartBars || !xAxis) return;

    chartBars.innerHTML = `<div class="grid-line" style="bottom: 50%;"></div><div class="grid-line" style="bottom: 100%;"></div>`;
    xAxis.innerHTML = "";

    candidates.forEach(c => {
        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";
        barWrapper.innerHTML = `<div class="bar" style="height: ${c.score}%;"></div>`;
        chartBars.appendChild(barWrapper);

        const label = document.createElement("span");
        label.className = "bar-label";
        label.innerText = c.shortName;
        xAxis.appendChild(label);
    });
}

// AI Assistant Action: Recalculate candidate matching based on new criteria
function applyAICriteria(event) {
    event.preventDefault();
    const title = document.getElementById("positionTitle").value;
    const skillsInput = document.getElementById("requiredSkills").value;
    
    if (!skillsInput.trim()) {
        alert("Please enter required skills.");
        return;
    }

    const reqSkills = skillsInput.split(",").map(s => s.trim().toLowerCase());

    candidates.forEach(c => {
        let matched = [];
        let missing = [];

        reqSkills.forEach(req => {
            const allCandSkills = [...c.matchedSkills, ...c.missingSkills].map(s => s.trim());
            const foundSkill = allCandSkills.find(s => s.toLowerCase() === req);

            if (foundSkill) {
                matched.push(foundSkill);
            } else {
                missing.push(req.toUpperCase());
            }
        });

        c.matchedSkills = matched;
        c.missingSkills = missing;
        c.score = Math.round((matched.length / reqSkills.length) * 100);
    });

    sortCandidates();
    alert(`AI recalculation complete for "${title}"! Applicants match scores have been updated.`);
    
    // Switch to Applicants tab to show updated result
    switchTab('applicants', document.querySelectorAll('.tab-btn')[0]);
}