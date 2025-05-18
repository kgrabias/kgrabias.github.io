document.addEventListener('DOMContentLoaded', () => {
    const loginPopup = document.querySelector('#login-popup');
    const userBtn = document.querySelectorAll('.open-login');
    const closeBtn = document.querySelector('#close-login');
    const appContainer = document.querySelector('.main-layout');

    userBtn.forEach(btn => {
        btn.addEventListener('click', () => {
           
            const isHidden = loginPopup.classList.toggle('hidden');

            if (window.innerWidth > 767) {
                
                if (!isHidden) {
                    appContainer.classList.add('sidebar-hidden');
                    appContainer.classList.remove('sidebar-visible');
                } else {
                    appContainer.classList.remove('sidebar-hidden');
                    appContainer.classList.add('sidebar-visible');
                }
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        loginPopup.classList.add('hidden');

        if (window.innerWidth > 767) {
            appContainer.classList.remove('sidebar-hidden');
            appContainer.classList.add('sidebar-visible');
        }
    });

    loginPopup.addEventListener('click', (e) => {
        if (e.target === loginPopup) {
            loginPopup.classList.add('hidden');


            if (window.innerWidth > 767) {
                appContainer.classList.remove('sidebar-hidden');
                appContainer.classList.add('sidebar-visible');
            }
        }
    });

    
});