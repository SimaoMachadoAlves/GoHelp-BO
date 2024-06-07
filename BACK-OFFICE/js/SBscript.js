//SCRIPT SIDEBAR

document.querySelectorAll('.menu > ul > li').forEach(function(item) {
    item.addEventListener('click', function(e) {
        const subMenu = this.querySelector('ul');
        if (!subMenu) return; // Se não há submenu, não faça nada

        // Remove a classe 'active' dos irmãos do item clicado
        Array.from(this.parentNode.children).forEach(sib => {
            if (sib !== this) {
                sib.classList.remove('active');
                let sibSubMenu = sib.querySelector('ul');
                if (sibSubMenu) {
                    closeSubMenu(sibSubMenu); // Fechar outros submenus abertos
                }
            }
        });

        // Toggle 'active' para este item
        this.classList.toggle('active');

        // Se possui um submenu, inicia animação de toggle
        if (subMenu.style.display === 'block') {
            closeSubMenu(subMenu);
        } else {
            openSubMenu(subMenu);
        }
    });
});

function openSubMenu(subMenu) {
    subMenu.style.display = 'block';
    let height = 0;
    subMenu.style.height = `${height}px`;
    
    function step() {
        height += 50; // Ajuste este valor conforme a velocidade desejada
        subMenu.style.height = `${height}px`;
        if (height < subMenu.scrollHeight) {
            requestAnimationFrame(step); // Continua a animação até atingir a altura total
        } else {
            subMenu.style.height = ''; // Remove a altura fixa após completar a animação
        }
    }
    requestAnimationFrame(step);
}

function closeSubMenu(subMenu) {
    let height = subMenu.offsetHeight;
    function step() {
        height -= 50; // Ajuste este valor conforme a velocidade desejada
        subMenu.style.height = `${height}px`;
        if (height > 0) {
            requestAnimationFrame(step);
        } else {
            subMenu.style.display = 'none'; // Esconde o submenu após completar a animação
            subMenu.style.height = '';
        }
    }
    requestAnimationFrame(step);
}



document.querySelector('.menu-btn').addEventListener('click', function(){
        document.querySelector('.sidebar').classList.toggle('active');
});


  
























