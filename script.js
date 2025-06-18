window.addEventListener('scroll', function () {
    if (window.innerWidth <= 768) return;

    const trigger = document.getElementById('projectsTrigger');
    const socials = document.getElementById('socials');
    const locationText = document.getElementById('locationText');

    const triggerTop = trigger.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (triggerTop < windowHeight) {
        socials.style.right = "50px";
        socials.style.display = "flex";
        locationText.style.right = "-20px";
    } else {
        socials.style.right = "0";
        socials.style.display = "block";
        locationText.style.right = "50px";
    }
});
