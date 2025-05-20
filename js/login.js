document.addEventListener('DOMContentLoaded', () => {
    const loginPopup = document.querySelector('#login-popup');
    const userBtn = document.querySelectorAll('.open-login');
    const closeBtn = document.querySelector('#close-login');
    const loginPopupMobile = document.querySelector('#login-popup-mobile');
    const closeBtnMobile = document.querySelector('#close-login-mobile');
    const appContainer = document.querySelector('.main-layout');

    userBtn.forEach(btn => {
        btn.addEventListener('click', () => {

            if (window.innerWidth > 767) {
                const isHidden = loginPopup.classList.toggle('hidden');
                
                if (!isHidden) {
                    appContainer.classList.add('sidebar-hidden');
                    appContainer.classList.remove('sidebar-visible');
                } else {
                    appContainer.classList.remove('sidebar-hidden');
                    appContainer.classList.add('sidebar-visible');
                }
            } else {
                loginPopupMobile.classList.remove('hidden');
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
    closeBtnMobile.addEventListener('click', () => {
        loginPopupMobile.classList.add('hidden');
    });

    loginPopupMobile.addEventListener('click', (e) => {
        if (e.target === loginPopupMobile) {
            loginPopupMobile.classList.add('hidden');
        }
    });

/* fragment dot. przycisku trzech kropek 'more-info- */
/* z sidebar.js były jakieś konflikty więc dałam tu */
const moreInfoBtn = document.querySelector('#more-info-btn');
const moreInfoPopup = document.querySelector('#more-info-popup');

moreInfoBtn.addEventListener('click', () => {
  moreInfoPopup.classList.toggle('hidden');
});


const moreInfoBtnMobile = document.querySelector('#more-info-mobile-btn');
const moreInfoPopupMobile = document.querySelector('#more-info-popup-mobile');
moreInfoBtnMobile.addEventListener('click', () => {
  moreInfoPopupMobile.classList.toggle('hidden');
});  
    
});