document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const filterLevel = document.getElementById('filterLevel');
    const filterType = document.getElementById('filterType');
    const filterSkill = document.getElementById('filterSkill');
    const filterButton = document.getElementById('filterButton');
    const sortOptions = document.getElementById('sortOptions');
    const sortButton = document.getElementById('sortButton');
    const jobResults = document.getElementById('jobResults');

    let jobs = [];

    // Upload JSON file
    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                jobs = JSON.parse(event.target.result); // Parse JSON file
                displayJobs(jobs); // Display jobs
                populateFilters(jobs); // Populate filters dynamically
            } catch (err) {
                alert('Invalid JSON file format. Please ensure the file is valid.');
                console.error(err);
            }
        };
        reader.readAsText(file);
    });

    // Populate filters dynamically
    const populateFilters = (jobs) => {
        const levels = new Set(jobs.map(job => job.Level));
        const types = new Set(jobs.map(job => job.Type));
        const skills = new Set(jobs.map(job => job.Skill));

        filterLevel.innerHTML = '<option value="All">All</option>' + [...levels].map(level => `<option value="${level}">${level}</option>`).join('');
        filterType.innerHTML = '<option value="All">All</option>' + [...types].map(type => `<option value="${type}">${type}</option>`).join('');
        filterSkill.innerHTML = '<option value="All">All</option>' + [...skills].map(skill => `<option value="${skill}">${skill}</option>`).join('');
    };

    // Display jobs
    const displayJobs = (jobsToDisplay) => {
        if (jobsToDisplay.length === 0) {
            jobResults.innerHTML = '<p>No jobs available.</p>';
            return;
        }

        jobResults.innerHTML = jobsToDisplay.map(job => `
            <div class="job-item">
                <h3><a href="${job['Job Page Link']}" target="_blank">${job.Title}</a></h3>
                <p>Type: ${job.Type}</p>
                <p>Level: ${job.Level}</p>
                <p>Skill: ${job.Skill}</p>
                <p>Posted: ${job.Posted}</p>
                <p>Details: ${job.Detail}</p>
            </div>
        `).join('');
    };

    // Filter jobs
    const filterJobs = () => {
        let filteredJobs = jobs;
        const selectedLevel = filterLevel.value;
        const selectedType = filterType.value;
        const selectedSkill = filterSkill.value;

        if (selectedLevel !== 'All') filteredJobs = filteredJobs.filter(job => job.Level === selectedLevel);
        if (selectedType !== 'All') filteredJobs = filteredJobs.filter(job => job.Type === selectedType);
        if (selectedSkill !== 'All') filteredJobs = filteredJobs.filter(job => job.Skill === selectedSkill);

        displayJobs(filteredJobs);
    };

    // Sort jobs
    const sortJobs = () => {
        const selectedOption = sortOptions.value;
        const sortedJobs = [...jobs];

        if (selectedOption === 'title-asc') sortedJobs.sort((a, b) => a.Title.localeCompare(b.Title));
        if (selectedOption === 'title-desc') sortedJobs.sort((a, b) => b.Title.localeCompare(a.Title));
        if (selectedOption === 'time-asc') sortedJobs.sort((a, b) => new Date(a.Posted) - new Date(b.Posted));
        if (selectedOption === 'time-desc') sortedJobs.sort((a, b) => new Date(b.Posted) - new Date(a.Posted));

        displayJobs(sortedJobs);
    };

    // Event listeners for filters and sorting
    filterButton.addEventListener('click', filterJobs);
    sortButton.addEventListener('click', sortJobs);
});
