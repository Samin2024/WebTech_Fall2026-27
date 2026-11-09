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

let jobs = [
    {
        id: 1,
        title: "Senior React / Node.js Lead",
        location: "Dhaka / Remote",
        salary: "$1,200 - $1,800 / mo",
        vacancy: "2",
        experience: "3+ Years",
        skills: "React, Node.js, Express, MongoDB, Docker, AWS",
        description: "Looking for an experienced lead full-stack developer with strong React and Node expertise."
    }
];

let selectedCandidateId = 1;
let currentFilter = "All";
let editingJobId = null;

document.addEventListener("DOMContentLoaded", () => {
    renderCandidates();
    renderDetailPanel();
    renderChart();
    renderJobsList();
});

function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function showNotification(message) {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();

    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

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

function selectCandidate(id) {
    selectedCandidateId = id;
    renderCandidates();
    renderDetailPanel();
}

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

function updateStatus(id, newStatus) {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
        candidate.status = newStatus;
        renderCandidates();
        renderDetailPanel();
    }
}

function filterCandidates(status, buttonEl) {
    currentFilter = status;
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    buttonEl.classList.add('active');
    renderCandidates();
}

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
    showNotification(`AI criteria updated for "${title}"!`);
    switchTab('applicants', document.querySelectorAll('.tab-btn')[0]);
}

// --- JOB POST FEATURE & STRICT VALIDATION ---

function handleJobSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("jobTitleInput").value.trim();
    const location = document.getElementById("jobLocationInput").value.trim();
    const salary = document.getElementById("jobSalaryInput").value.trim();
    const vacancy = document.getElementById("jobVacancyInput").value.trim();
    const experience = document.getElementById("jobExperienceInput").value.trim();
    const skills = document.getElementById("jobSkillsInput").value.trim();
    const description = document.getElementById("jobDescInput").value.trim();

    // Clear previous error texts
    document.querySelectorAll('.error-text').forEach(el => el.innerText = '');

    let isValid = true;

    if (!title) {
        document.getElementById("jobTitleError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!location) {
        document.getElementById("jobLocationError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!salary) {
        document.getElementById("jobSalaryError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!vacancy) {
        document.getElementById("jobVacancyError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!experience) {
        document.getElementById("jobExperienceError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!skills) {
        document.getElementById("jobSkillsError").innerText = "Please fill the box";
        isValid = false;
    }
    if (!description) {
        document.getElementById("jobDescError").innerText = "Please fill the box";
        isValid = false;
    }

    if (!isValid) {
        showNotification("Please fill the box");
        return;
    }

    if (editingJobId !== null) {
        // Update existing job
        const job = jobs.find(j => j.id === editingJobId);
        if (job) {
            job.title = title;
            job.location = location;
            job.salary = salary;
            job.vacancy = vacancy;
            job.experience = experience;
            job.skills = skills;
            job.description = description;
        }
        editingJobId = null;
        document.getElementById("jobSubmitBtn").innerText = "Post Job Vacancy";
    } else {
        // Create new job
        const newJob = {
            id: Date.now(),
            title,
            location,
            salary,
            vacancy,
            experience,
            skills,
            description
        };
        jobs.push(newJob);
    }

    document.getElementById("jobPostForm").reset();
    renderJobsList();
    showNotification("JOB POSTED");
}

function renderJobsList() {
    const listContainer = document.getElementById("postedJobsList");
    if (!listContainer) return;

    if (jobs.length === 0) {
        listContainer.innerHTML = `<p style="color:#64748b; font-size:13px; text-align:center;">No job postings available.</p>`;
        return;
    }

    listContainer.innerHTML = "";
    jobs.forEach(j => {
        const item = document.createElement("div");
        item.className = "job-item-card";
        item.innerHTML = `
            <div class="job-info">
                <h4>${j.title} (${j.vacancy || 1} Vacancy)</h4>
                <p>📍 ${j.location || 'Remote'} | 💰 ${j.salary || 'Negotiable'} | ⏱️ Exp: ${j.experience || 'N/A'}</p>
                <p><strong>Required Skills:</strong> ${j.skills}</p>
            </div>
            <div class="job-actions">
                <button class="btn-edit" onclick="editJob(${j.id})">Edit</button>
                <button class="btn-delete" onclick="deleteJob(${j.id})">Delete</button>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function editJob(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    document.getElementById("jobTitleInput").value = job.title;
    document.getElementById("jobLocationInput").value = job.location;
    document.getElementById("jobSalaryInput").value = job.salary;
    document.getElementById("jobVacancyInput").value = job.vacancy;
    document.getElementById("jobExperienceInput").value = job.experience;
    document.getElementById("jobSkillsInput").value = job.skills;
    document.getElementById("jobDescInput").value = job.description;

    editingJobId = id;
    document.getElementById("jobSubmitBtn").innerText = "Update Job Post";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteJob(id) {
    jobs = jobs.filter(j => j.id !== id);
    renderJobsList();
    showNotification("JOB POST DELETED");
}