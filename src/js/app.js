document.addEventListener('DOMContentLoaded', function(){
    scrollNav();
    resaltarEnlace();
    navegacionFija();
    crearGaleria();
});
function scrollNav(){
    const navLinks = document.querySelectorAll('.nav-principal a');
    navLinks.forEach(link => {
        link.addEventListener('click', e =>{
            e.preventDefault();
            const sectionScroll = e.target.getAttribute('href');
            const section = document.querySelector(sectionScroll);

            section.scrollIntoView({behavior: 'smooth'});
        })
    })
}



function resaltarEnlace(){
    document.addEventListener('scroll', () => {
        const section = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-principal a');

        let actual = '';
        section.forEach( section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(window.scrollY >= (sectionTop - sectionHeight / 3)){
                actual = section.id;
            }
        })
        navLinks.forEach(link =>{
            if(link.getAttribute('href') == '#' + actual){
                link.classList.add('active');
            } else{
                link.classList.remove('active');
            }
        })
    })
}


function navegacionFija(){
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    document.addEventListener('scroll', ()=> {
        if(sobreFestival.getBoundingClientRect().bottom < 1){
            header.classList.add('fijar')
        } else {
            header.classList.remove('fijar')
        }
    } )
}

function crearGaleria(){
    const cantidad_imagenes = 16;
    const galeria = document.querySelector('.galeria-imagenes');

    for(let i = 1; i <= cantidad_imagenes; i++){
        const imagen = document.createElement('PICTURE');
        imagen.innerHTML = `
            <source srcset="build/img/gallery/thumb/${i}.avif" type="image/avif"/>
            <source srcset="build/img/gallery/thumb/${i}.webp" type="image/webp"/>
            <img  width="200" height="300" loading="lazy" src="build/img/gallery/thumb/${i}.jpg"
            alt="imagen galeria">
        `
        
        //Event Handler
        imagen.onclick = function(){
            mostrarImagen(i);
        }


        galeria.appendChild(imagen);
    }
}
function mostrarImagen(i){
    const imagen = document.createElement('PICTURE');
    imagen.innerHTML = `
            <source srcset="build/img/gallery/full/${i}.avif" type="image/avif"/>
            <source srcset="build/img/gallery/full/${i}.webp" type="image/webp"/>
            <img loading="lazy" width="200" height="300" src="build/img/gallery/full/${i}.jpg"
            alt="imagen galeria">
        `
    
    //generar Modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.onclick = cerrarModal;
    //BOTON CERRAR MODAL
    const closeBtn = document.createElement('BUTTON');
    closeBtn.textContent = 'X';
    closeBtn.classList.add('closeBtn');
    closeBtn.onclick = cerrarModal;

    modal.appendChild(imagen);
    modal.appendChild(closeBtn);

    //agregar al html
    const body = document.querySelector('body');
    body.classList.add('overFlow-hidden');
    body.appendChild(modal);
}
function cerrarModal(){
    const modal = document.querySelector('.modal');
    modal.classList.add('fadeOut');
    
    setTimeout(() => {
        modal?.remove();
        const body = document.querySelector('body');
        body.classList.remove('overFlow-hidden');
    }, 500);
    
}