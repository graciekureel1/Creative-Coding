document.addEventListener('DOMContentLoaded', () => {
    createFloatingShapes();
    createAnimatedEntity();
});

function createFloatingShapes() {
    const scene = document.querySelector('a-scene');

    for (let i = 0; i < 20; i++) {
        let shape = document.createElement('a-box');
        shape.setAttribute('position', `${Math.random() * 10 - 5} ${Math.random() * 5 + 1} ${Math.random() * -10}`);
        shape.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
        shape.setAttribute('scale', `${Math.random()} ${Math.random()} ${Math.random()}`);

        scene.appendChild(shape);
    }
}

function createAnimatedEntity() {
    const scene = document.querySelector('a-scene');
    let entity = document.createElement('a-torus-knot');

    entity.setAttribute('position', '0 2 -5');
    entity.setAttribute('color', '#FFC0CB');
    entity.setAttribute('radius', '2');
    entity.setAttribute('animation', 'property: rotation; to: 360 360 0; loop: true; dur: 10000');

    scene.appendChild(entity);
}
