document.addEventListener("DOMContentLoaded", function () {
    const btnAboutme = document.getElementById('btn-aboutme');
    const divAboutme = document.getElementById('info');
    const btnHide = document.getElementById('btn-hide');
    const btnDarkmode = document.getElementById('btn-darkmode');

    
    btnAboutme.addEventListener('click', function () {
        if (divAboutme.classList.contains('hide')) {
            divAboutme.classList.remove('hide');
            btnAboutme.textContent = "Show Less";
        } else {
            divAboutme.classList.add('hide');
            btnAboutme.textContent = "About Me";
        }
    });

    // Hide About Me
    btnHide.addEventListener('click', function () {
        divAboutme.classList.add('hide');
        btnAboutme.textContent = "About Me";
    });

    // Toggle Dark Mode
    btnDarkmode.addEventListener('click', function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            document.getElementById(p);
            btnDarkmode.textContent = "☀️ Light Mode";
        } else {
            btnDarkmode.textContent = "🌙 Dark Mode";
        }
    });
});