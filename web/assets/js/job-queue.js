const { hostname } = window.location; // Gets the host without port
const baseUrl = `http://${hostname}:5000`; // Append the port 5000
const apiUrl = `${baseUrl}/jobs/`;
const addJobForm = document.getElementById("addJobForm");
const jobsList = document.getElementById("jobsList");
const mobileJobsList = document.getElementById("mobileJobsList");

const container = document.querySelector(".job-queue-container");
const desktopView = document.querySelector(".desktop-view");
const mobileView = document.querySelector(".mobile-view");

// Function to handle view changes
function updateView() {
  if (container.offsetWidth < 400) {
    mobileView.classList.add("show");
    mobileView.classList.remove("hide");

    desktopView.classList.add("hide");
    desktopView.classList.remove("show");
  } else {
    mobileView.classList.add("hide");
    mobileView.classList.remove("show");

    desktopView.classList.add("show");
    desktopView.classList.remove("hide");
  }
}

// Listen for changes in container size
const resizeObserver = new ResizeObserver(updateView);
resizeObserver.observe(container);

// Initial check
updateView();

function toggleLoader(show) {
  const loaders = document.querySelectorAll(".jobs-loader-overlay");
  loaders.forEach((loader) => {
    loader.style.display = show ? "flex" : "none";
  });
}

function fetchJobs() {
  toggleLoader(true); // Show loader
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      jobsList.innerHTML = "";
      mobileJobsList.innerHTML = "";

      data.forEach((job) => {
        // Desktop Table Row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${job.id}</td>
            <td>${job.description}</td>
            <td class="btn-group">
              <button class="btn load-btn" data-job-id="${job.id}">Load</button>
              <button class="btn delete-btn" data-job-id="${job.id}">Delete</button>
            </td>
          `;
        jobsList.appendChild(row);

        // Mobile Table Row
        const mobileRow = document.createElement("tr");
        mobileRow.innerHTML = `
            <td class="mobile-id-description">
                <div class="item-content">
                <div>ID: ${job.id}</div>
                <div>Description: ${job.description}</div>
                </div>
                <div class="mobile-buttons">
                <button class="btn load-btn" data-job-id="${job.id}">Load</button>
                <button class="btn delete-btn" data-job-id="${job.id}">Delete</button>
                </div>
            </td>
          `;
        mobileJobsList.appendChild(mobileRow);

        toggleLoader(false); // Hide loader
      });
    })
    .catch((error) => {
      console.error("Error fetching jobs:", error);
      toggleLoader(false); // Hide loader in case of error
    });
}

async function getJobs() {
  const response = await fetch(apiUrl);
  return response.json();
}

async function addJob(event) {
  jobs = JSON.parse(JSON.stringify(await getJobs()));
  last_id = 0;
  if (jobs.length > 0) {
    last_id = jobs[jobs.length - 1].id;
  }

  id = last_id + 1;
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      description: "description" + id,
      status: "queued",
    }),
  })
    .then((response) => response.json())
    .then(() => {
      fetchJobs();
    })
    .catch((error) => console.error("Error adding job:", error));
}

function deleteJob(jobId) {
  fetch(apiUrl + jobId, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => fetchJobs())
    .catch((error) => console.error("Error deleting job:", error));
}

function loadJob(jobId) {
  document
    .getElementById("add_button")
    .style.setProperty("display", "none", "important");
  fetch(apiUrl + jobId)
    .then((response) => response.json())
    .then((job) => {
      const jobDetailsElement = document.querySelector("#jobDetails");
      jobDetailsElement.innerHTML = `
          <p>ID: ${job.id}</p>
          <p>Description: ${job.description}</p>
          <p>Status: ${job.status}</p>
        `;

      document.querySelectorAll(".tab-button").forEach((button) => {
        button.style.setProperty("display", "block", "important");
      });

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      document.querySelector(`.detailsTab`).classList.add("active");
    })
    .catch((error) => console.error("Error loading job:", error));
}

fetchJobs();

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .getElementById("add_button")
      .style.setProperty("display", "block", "important");

    const tabId = button.getAttribute("data-tab");

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });

    document.querySelectorAll(".tab-button").forEach((button) => {
      button.style.setProperty("display", "none", "important");
    });

    document.querySelector(`.${tabId}`).classList.add("active");
  });
});

document.querySelector("#jobsList").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("load-btn")) {
    const jobId = e.target.dataset.jobId;
    loadJob(jobId);
  } else if (e.target && e.target.classList.contains("delete-btn")) {
    const jobId = e.target.dataset.jobId;
    deleteJob(jobId);
  }
});

document
  .querySelector("#mobileJobsList")
  .addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("load-btn")) {
      const jobId = e.target.dataset.jobId;
      loadJob(jobId);
    } else if (e.target && e.target.classList.contains("delete-btn")) {
      const jobId = e.target.dataset.jobId;
      deleteJob(jobId);
    }
  });

document.querySelectorAll(".tab-button").forEach((button) => {
  button.style.setProperty("display", "none", "important");
});
