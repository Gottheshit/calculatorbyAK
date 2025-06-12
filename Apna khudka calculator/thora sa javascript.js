let isDegrees = true;
let memory = 0;
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

const resultInput = document.getElementById('result');
const historyList = document.getElementById('history-list');
const themeBtn = document.getElementById('theme-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHistory();
    themeBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Theme Toggle
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Append functions
function appendOperator(value) {
    resultInput.value += value;
}

function appendFunction(func) {
    resultInput.value += func;
}

function appendConstant(constant) {
    resultInput.value += constant;
}

function appendTrig(func) {
    resultInput.value += func + '(';
}

// Clear and delete
function clearDisplay() {
    resultInput.value = '';
}

function deleteLast() {
    resultInput.value = resultInput.value.slice(0, -1);
}

// Calculate
function calculate() {
    let expression = resultInput.value;
    try {
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        expression = expression.replace(/pow\(/g, 'Math.pow(');
        expression = expression.replace(/log10\(/g, 'Math.log10(');
        
        // Handle trigonometric functions based on mode
        if (isDegrees) {
            expression = expression.replace(/sin\(/g, 'Math.sin(Math.PI/180*');
            expression = expression.replace(/cos\(/g, 'Math.cos(Math.PI/180*');
            expression = expression.replace(/tan\(/g, 'Math.tan(Math.PI/180*');
        } else {
            expression = expression.replace(/sin\(/g, 'Math.sin(');
            expression = expression.replace(/cos\(/g, 'Math.cos(');
            expression = expression.replace(/tan\(/g, 'Math.tan(');
        }

        const result = eval(expression);
        
        // Add to history
        history.unshift({
            expression: resultInput.value,
            result: result,
            timestamp: new Date().toLocaleString()
        });
        
        // Keep only last 10 calculations
        if (history.length > 10) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('calcHistory', JSON.stringify(history));
        
        // Update display
        resultInput.value = result;
        updateHistory();
    } catch (error) {
        resultInput.value = 'Error';
    }
}

// Update history display
function updateHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.expression} = ${item.result} (${item.timestamp})`;
        historyList.appendChild(li);
    });
}

// Memory functions
function memoryStore() {
    memory = parseFloat(resultInput.value) || 0;
}

function memoryRecall() {
    resultInput.value = memory;
}

function memoryClear() {
    memory = 0;
}

// Toggle between degrees and radians
function toggleAngleMode() {
    isDegrees = !isDegrees;
    document.getElementById('angle-mode').textContent = isDegrees ? 'DEG' : 'RAD';
}

 
// ... existing JavaScript ...

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Delete') {
        clearDisplay();
    }
});

// Append function
function appendFunction(func) {
    resultInput.value += func;
}

// Graph plotting using Chart.js
function plotGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    const expression = resultInput.value;
    const xValues = [];
    const yValues = [];

    for (let x = -10; x <= 10; x += 0.1) {
        try {
            const y = eval(expression.replace(/x/g, x));
            xValues.push(x);
            yValues.push(y);
        } catch (e) {
            // Handle errors
        }
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'f(x)',
                data: yValues,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}
