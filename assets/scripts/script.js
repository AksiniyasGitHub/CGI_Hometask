document.addEventListener('DOMContentLoaded', () => {
    const introArticle = document.querySelector('.introduction-article');
    const formContent = document.querySelector('.form-content');
    const startButton = document.querySelector('.introduction-article-btn');

    const questions = [
        { question: "Are you already a Swedbank customer?", type: "radio", name: "customer", options: ["Yes", "No"] },
        { question: "What is your income source?", type: "select", name: "income", options: ["Employment", "Business", "Pension", "Other"] },
        { question: "Which services are you interested in?", type: "checkbox", name: "services", options: ["Travel insurance", "Cashback", "Lower interest rate"] },
        { question: "Describe your financial goals:", type: "textarea", name: "goals" },
        { question: `Would you like an additional card? <span class="tooltip">i<span class="tooltip-text">The additional card gives the same benefits as the main card.</span></span>`,
            summary: "Would you like an additional card?",
            type: "radio",
            name: "extraCard",
            options: ["Yes", "No"] }
    ];

    let currentStep = 0;
    const answers = {};

    if (startButton) {
        startButton.addEventListener('click', () => {
            introArticle.style.display = 'none';
            formContent.classList.add('active');
            renderQuestion(currentStep);
        });
    }

    function renderQuestion(index) {
        const q = questions[index];
        let inputHTML = '';

        if (q.type === "radio") {
            q.options.forEach(opt => {
                const isChecked = answers[q.name] === opt ? 'checked' : '';
                inputHTML += `<label><input type="radio" name="${q.name}" value="${opt}" ${isChecked}> ${opt}</label>`;
            });
        } else if (q.type === "select") {
            inputHTML += `<select name="${q.name}"><option value="">Select...</option>`;
            q.options.forEach(opt => {
                const isSelected = answers[q.name] === opt ? 'selected' : '';
                inputHTML += `<option value="${opt}" ${isSelected}>${opt}</option>`;
            });
            inputHTML += `</select>`;
        } else if (q.type === "checkbox") {
            const selectedValues = answers[q.name] ? answers[q.name].split(', ') : [];
            q.options.forEach(opt => {
                const isChecked = selectedValues.includes(opt) ? 'checked' : '';
                inputHTML += `<label><input type="checkbox" name="${q.name}" value="${opt}" ${isChecked}> ${opt}</label>`;
            });
        } else if (q.type === "textarea") {
            const value = answers[q.name] || '';
            inputHTML += `<textarea name="${q.name}">${value}</textarea>`;
        }

        formContent.innerHTML = `
      <h2>${q.question}</h2>
      <form id="question-form">${inputHTML}<div class="error" id="error-msg"></div></form>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px;">
        ${index > 0 ? '<button type="button" class="prev-btn btn">Previous</button>' : ''}
        <button type="button" class="next-btn btn">Next</button>
      </div>
    `;

        const nextBtn = formContent.querySelector('.next-btn');
        const prevBtn = formContent.querySelector('.prev-btn');

        if (nextBtn) nextBtn.addEventListener('click', next);
        if (prevBtn) prevBtn.addEventListener('click', previous);
    }

    function validate() {
        const q = questions[currentStep];
        const form = document.forms['question-form'];
        let valid = false;

        if (q.type === "radio") {
            valid = [...form.elements[q.name]].some(r => r.checked);
            if (valid) answers[q.name] = form[q.name].value;
        } else if (q.type === "select") {
            valid = form[q.name].value !== "";
            if (valid) answers[q.name] = form[q.name].value;
        } else if (q.type === "checkbox") {
            const selected = [...form.elements[q.name]].filter(c => c.checked).map(c => c.value);
            valid = selected.length > 0;
            if (valid) answers[q.name] = selected.join(', ');
        } else if (q.type === "textarea") {
            valid = form[q.name].value.trim() !== "";
            if (valid) answers[q.name] = form[q.name].value.trim();
        }

        if (!valid) {
            document.getElementById('error-msg').innerText = "Please answer before proceeding.";
        }

        return valid;
    }

    function next() {
        if (!validate()) return;
        currentStep++;
        if (currentStep < questions.length) {
            renderQuestion(currentStep);
        } else {
            showSummary();
        }
    }

    function previous() {
        currentStep--;
        renderQuestion(currentStep);
    }

    function showSummary() {
        let summaryHTML = '<h2>Summary</h2><ul class="list">';
        questions.forEach(q => {
            const label = q.summary || q.question.replace(/<[^>]*>/g, '');
            summaryHTML += `<li>${label} <i>${answers[q.name]}</i></li>`;
        });
        summaryHTML += `
        </ul>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <button type="button" class="btn prev-btn-summary">Previous</button>
            <button class="btn" onclick="location.reload()">Start over</button>
        </div>
    `;
        formContent.innerHTML = summaryHTML;

        const prevBtnSummary = formContent.querySelector('.prev-btn-summary');
        if (prevBtnSummary) {
            prevBtnSummary.addEventListener('click', () => {
                currentStep = questions.length - 1;
                renderQuestion(currentStep);
            });
        }
    }
});
