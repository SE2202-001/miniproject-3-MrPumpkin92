document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const filterLevel = document.getElementById('filterLevel');
    const filterType = document.getElementById('filterType');
    const filterSkill = document.getElementById('filterSkill');
    const sortOptions = document.getElementById('sortOptions');
    const sortButton = document.getElementById('sortButton');
    const jobResults = document.getElementById('jobResults');

    let jobs = []; // Stores all jobs
    let filteredJobs = []; // Stores filtered jobs for display

    // Handle JSON file upload
    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // Ensure data is an array of jobs
                if (Array.isArray(data)) {
                    jobs = data;
                    filteredJobs = jobs; // Initialize filtered jobs
                    populateFilters(jobs); // Populate filters dynamically
                    displayJobs(jobs); // Display jobs initially
                } else {
                    alert('Error: Uploaded file does not contain a valid array of jobs.');
                }
            } catch (err) {
                alert('Error reading file: Ensure it is a valid JSON.');
            }
        };
        reader.readAsText(file);
    });

    // Populate filters dynamically based on job data
    const populateFilters = (jobList) => {
        const levels = new Set(jobList.map(job => job.Level || 'Unknown Level'));
        const types = new Set(jobList.map(job => job.Type || 'Unknown Type'));
        const skills = new Set(jobList.map(job => job.Skill || 'Unknown Skill'));

        filterLevel.innerHTML = '<option value="All">All</option>' + [...levels].map(level => `<option value="${level}">${level}</option>`).join('');
        filterType.innerHTML = '<option value="All">All</option>' + [...types].map(type => `<option value="${type}">${type}</option>`).join('');
        filterSkill.innerHTML = '<option value="All">All</option>' + [...skills].map(skill => `<option value="${skill}">${skill}</option>`).join('');
    };

    // Display jobs in the "Job Listings" section
    const displayJobs = (jobsToDisplay) => {
        if (jobsToDisplay.length === 0) {
            jobResults.innerHTML = '<p>No jobs available.</p>';
            return;
        }
        jobResults.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Level</th>
                        <th>Skill</th>
                        <th>Posted</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobsToDisplay.map(job => `
                        <tr>
                            <td><a href="${job['Job Page Link']}" target="_blank">${job.Title}</a></td>
                            <td>${job.Type}</td>
                            <td>${job.Level}</td>
                            <td>${job.Skill}</td>
                            <td>${job.Posted}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    // Apply filters to the job list
    const applyFilters = () => {
        const selectedLevel = filterLevel.value;
        const selectedType = filterType.value;
        const selectedSkill = filterSkill.value;

        filteredJobs = jobs.filter(job => {
            const matchesLevel = selectedLevel === 'All' || job.Level === selectedLevel;
            const matchesType = selectedType === 'All' || job.Type === selectedType;
            const matchesSkill = selectedSkill === 'All' || job.Skill.includes(selectedSkill);
            return matchesLevel && matchesType && matchesSkill;
        });

        displayJobs(filteredJobs);
    };

    // Apply sorting to the job list
    const sortJobs = () => {
        const option = sortOptions.value;

        if (option === 'title-asc') {
            filteredJobs.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (option === 'title-desc') {
            filteredJobs.sort((a, b) => b.Title.localeCompare(a.Title));
        } else if (option === 'time-asc') {
            filteredJobs.sort((a, b) => new Date(a.Posted) - new Date(b.Posted));
        } else if (option === 'time-desc') {
            filteredJobs.sort((a, b) => new Date(b.Posted) - new Date(a.Posted));
        }

        displayJobs(filteredJobs);
    };

    // Attach filter and sort event listeners
    filterLevel.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterSkill.addEventListener('change', applyFilters);
    sortButton.addEventListener('click', sortJobs);
});
