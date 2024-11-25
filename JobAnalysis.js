document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const filterLevel = document.getElementById('filterLevel');
    const filterType = document.getElementById('filterType');
    const filterSkill = document.getElementById('filterSkill');
    const sortButton = document.getElementById('sortButton');
    const sortOptions = document.getElementById('sortOptions');
    const jobResults = document.getElementById('jobResults');

    let jobs = [];

    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                jobs = JSON.parse(event.target.result);
                populateFilters();
                displayJobs(jobs);
            } catch (err) {
                alert('Error reading file: Ensure it is a valid JSON.');
            }
        };
        reader.readAsText(file);
    });

    const populateFilters = () => {
        const levels = new Set(jobs.map(job => job.level));
        const types = new Set(jobs.map(job => job.type));
        const skills = new Set(jobs.map(job => job.skill));

        filterLevel.innerHTML = '<option value="All">All</option>' + [...levels].map(level => `<option value="${level}">${level}</option>`).join('');
        filterType.innerHTML = '<option value="All">All</option>' + [...types].map(type => `<option value="${type}">${type}</option>`).join('');
        filterSkill.innerHTML = '<option value="All">All</option>' + [...skills].map(skill => `<option value="${skill}">${skill}</option>`).join('');
    };

    const displayJobs = (jobsToDisplay) => {
        if (jobsToDisplay.length === 0) {
            jobResults.innerHTML = 'No jobs available.';
            return;
        }
        jobResults.innerHTML = jobsToDisplay.map(job => `
            <div class="job-item">
                <h3>${job.title}</h3>
                <p>Type: ${job.type}</p>
                <p>Level: ${job.level}</p>
                <p>Skill: ${job.skill}</p>
                <p>Posted: ${job.posted}</p>
            </div>
        `).join('');
    };

    const filterJobs = () => {
        let filteredJobs = jobs;
        const level = filterLevel.value;
        const type = filterType.value;
        const skill = filterSkill.value;

        if (level !== 'All') filteredJobs = filteredJobs.filter(job => job.level === level);
        if (type !== 'All') filteredJobs = filteredJobs.filter(job => job.type === type);
        if (skill !== 'All') filteredJobs = filteredJobs.filter(job => job.skill === skill);

        displayJobs(filteredJobs);
    };

    const sortJobs = () => {
        const option = sortOptions.value;
        let sortedJobs = [...jobs];

        if (option === 'title-asc') sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
        if (option === 'title-desc') sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
        if (option === 'time-asc') sortedJobs.sort((a, b) => new Date(a.posted) - new Date(b.posted));
        if (option === 'time-desc') sortedJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));

        displayJobs(sortedJobs);
    };

    filterLevel.addEventListener('change', filterJobs);
    filterType.addEventListener('change', filterJobs);
    filterSkill.addEventListener('change', filterJobs);
    sortButton.addEventListener('click', sortJobs);
});
