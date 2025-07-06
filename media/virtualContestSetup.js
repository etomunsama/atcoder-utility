const vscode = acquireVsCodeApi();

document.getElementById('startButton').addEventListener('click', () => {
    const minDifficulty = document.getElementById('minDifficulty').value;
    const maxDifficulty = document.getElementById('maxDifficulty').value;
    const durationValue = document.getElementById('durationValue').value;
    const durationUnit = document.getElementById('durationUnit').value;

    const contestTypes = [];
    if (document.getElementById('typeABC').checked) contestTypes.push('abc');
    if (document.getElementById('typeARC').checked) contestTypes.push('arc');
    if (document.getElementById('typeAGC').checked) contestTypes.push('agc');
    if (document.getElementById('typeABCLike').checked) contestTypes.push('abc-like');
    if (document.getElementById('typeARCLike').checked) contestTypes.push('arc-like');
    if (document.getElementById('typeAGCLike').checked) contestTypes.push('agc-like');

    const includeAccepted = document.getElementById('includeAccepted').checked;

    vscode.postMessage({
        type: 'startVirtualContest',
        value: {
            minDifficulty: minDifficulty === '' ? -9999 : parseInt(minDifficulty),
            maxDifficulty: parseInt(maxDifficulty),
            duration: { value: parseInt(durationValue), unit: durationUnit },
            contestTypes: contestTypes,
            includeAccepted: includeAccepted
        }
    });
});