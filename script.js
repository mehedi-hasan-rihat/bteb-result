document.getElementById('resultForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const button = e.target.querySelector('button');
    button.classList.add('loading');

    const rollNumber = document.getElementById('rollNumber').value;
    const url = `https://btebresulthub-temp-server.vercel.app/results/individual/${rollNumber}`;
    const proxyUrl = 'https://proxy.cors.sh/' + url;

    fetch(proxyUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load resource');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayResult(data);
        button.classList.remove('loading');
        // Process the data here
    })
    .catch(error => {
        console.error(error);
        displayError('Error loading result. Please try again later.');
        console.error(error);
        button.classList.remove('loading');
        // Handle the error here
    });
});

function displayResult(data) {
    const leftColumn = document.querySelector('.result-left');
    const rightColumn = document.querySelector('.result-right');

    leftColumn.innerHTML = `
        <p><strong>Roll Number:</strong> ${data.roll}</p>
        <p><strong>Regulation:</strong> ${data.regulation}</p>
        <p><strong>Exam:</strong> ${data.exam}</p>
        <h3>Institute Details:</h3>
        <p><strong>Institute Code:</strong> ${data.instituteData.code}</p>
        <p><strong>Institute Name:</strong> ${data.instituteData.name}</p>
        <p><strong>District:</strong> ${data.instituteData.district}</p>
    `;

    const resultList = data.resultData.map(result => {
        let resultContent = `
            <li>
                <p><strong>Semester:</strong> ${result.semester}</p>
                <p><strong>Published Date:</strong> ${new Date(result.publishedAt).toLocaleDateString()}</p>
                <p><strong>GPA:</strong> ${result.result || "N/A"}</p>
                <p><strong>Status:</strong> ${result.passed ? 'Passed' : 'Failed'}</p>
        `;

        if (!result.passed && result.result && result.result.failedList) {
            const failedSubjects = result.result.failedList.map(subject => `
                <div class="failed-subject">
                    <p><strong>Subject Name:</strong> ${subject.subjectName}</p>
                    <p><strong>Subject Code:</strong> ${subject.subjectCode}</p>
                    <p><strong>Type:</strong> ${subject.failedType}</p>
                </div>
            `).join('');
            resultContent += `
                <h4>Failed Subjects:</h4>
                <div class="failed-subjects">${failedSubjects}</div>
            `;
        }

        resultContent += `</li><hr>`;
        return resultContent;
    }).join('');

    rightColumn.innerHTML = `
        <h3>Results:</h3>
        <ul>${resultList}</ul>
    `;
}

function displayError(message) {
    const resultDisplay = document.querySelector('.result-left');
    resultDisplay.innerHTML = `<p style="color: red;">${message}</p>`;
}
