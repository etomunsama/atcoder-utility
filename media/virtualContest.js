const vscode = acquireVsCodeApi();

document.addEventListener('DOMContentLoaded', () => {
    const diffFilter = document.getElementById('diff-filter');
    const probFilter = document.getElementById('prob-filter');
    const diffInputs = document.getElementById('diff-inputs');
    const probInputs = document.getElementById('prob-inputs');
    const timerDiv = document.getElementById('timer');
    const startButton = document.getElementById('start-contest');
    const stopButton = document.getElementById('stop-contest');
    const nextProblemButton = document.getElementById('next-problem');

    diffFilter.addEventListener('change', () => {
        if (diffFilter.checked) {
            diffInputs.style.display = 'block';
            probInputs.style.display = 'none';
        }
    });

    probFilter.addEventListener('change', () => {
        if (probFilter.checked) {
            diffInputs.style.display = 'none';
            probInputs.style.display = 'block';
        }
    });

    startButton.addEventListener('click', () => {
        const days = document.getElementById('days').value;
        const hours = document.getElementById('hours').value;
        const minutes = document.getElementById('minutes').value;

        const contestTypes = Array.from(document.querySelectorAll('input[name="contest-type"]:checked')).map(el => el.value);

        const filterType = document.querySelector('input[name="filter-type"]:checked').value;

        let filterValue;
        if (filterType === 'diff') {
            filterValue = {
                min: document.getElementById('min-diff').value,
                max: document.getElementById('max-diff').value
            };
        } else {
            filterValue = {
                min: document.getElementById('min-prob').value,
                max: document.getElementById('max-prob').value
            };
        }

        const filters = Array.from(document.querySelectorAll('input[name="filter"]:checked')).map(el => el.value);

        vscode.postMessage({
            type: 'startVirtualContest',
            value: {
                duration: {
                    days,
                    hours,
                    minutes
                },
                contestTypes,
                filterType,
                filterValue,
                filters
            }
        });
    });

    stopButton.addEventListener('click', () => {
        vscode.postMessage({ type: 'stopVirtualContest' });
    });

    nextProblemButton.addEventListener('click', () => {
        vscode.postMessage({ type: 'nextProblem' });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'updateTimer':
                if (message.value) {
                    timerDiv.textContent = message.value;
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    nextProblemButton.disabled = false;
                } else {
                    timerDiv.textContent = '';
                    startButton.disabled = false;
                    stopButton.disabled = true;
                    nextProblemButton.disabled = true;
                }
                break;
        }
    });
});