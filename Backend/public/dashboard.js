document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('api-form');
    const methodSelect = document.getElementById('method');
    const bodyGroup = document.getElementById('body-group');
    const responseEl = document.getElementById('response');

    methodSelect.addEventListener('change', () => {
        if (methodSelect.value === 'GET' || methodSelect.value === 'DELETE') {
            bodyGroup.style.display = 'none';
        } else {
            bodyGroup.style.display = 'flex';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const method = document.getElementById('method').value;
        const url = document.getElementById('url').value;
        const body = document.getElementById('body').value;

        const options = {
            method: method,
            headers: {}
        };

        if (method === 'POST' || method === 'PUT') {
            options.headers['Content-Type'] = 'application/json';
            try {
                options.body = JSON.stringify(JSON.parse(body));
            } catch (error) {
                responseEl.textContent = `Error parsing JSON body: ${error.message}`;
                return;
            }
        }

        responseEl.textContent = 'Loading...';

        try {
            const res = await fetch(url, options);
            const data = await res.json();
            responseEl.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            responseEl.textContent = `Error: ${error.message}`;
        }
    });
});
