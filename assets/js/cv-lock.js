document.addEventListener('DOMContentLoaded', function () {
    var section = document.getElementById('cv');
    var gate = document.getElementById('cv-gate');
    var input = document.getElementById('cv-password');
    var status = document.getElementById('cv-status');
    var details = document.getElementById('cv-details');
    var unlockKey = 'cvUnlocked';
    var password = 'CV_1290!';

    if (!section || !gate || !input || !status || !details) {
        return;
    }

    function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(isError));
        status.classList.toggle('is-success', !isError && Boolean(message));
    }

    function unlockCV() {
        details.hidden = false;
        details.open = true;
        gate.classList.add('is-hidden');
        input.value = '';
        input.setAttribute('aria-invalid', 'false');
        section.classList.add('is-unlocked');
        sessionStorage.setItem(unlockKey, 'true');
        setStatus('Curriculum Vitae unlocked for this session.', false);
    }

    if (sessionStorage.getItem(unlockKey) === 'true') {
        unlockCV();
    } else if (window.location.hash === '#cv') {
        window.setTimeout(function () {
            input.focus();
        }, 150);
    }

    gate.addEventListener('submit', function (event) {
        event.preventDefault();

        if (input.value === password) {
            unlockCV();
            return;
        }

        input.setAttribute('aria-invalid', 'true');
        input.focus();
        input.select();
        setStatus('Incorrect password. Please try again.', true);
    });

    input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
            input.setAttribute('aria-invalid', 'false');
        }

        if (status.classList.contains('is-error')) {
            setStatus('', false);
        }
    });
});
