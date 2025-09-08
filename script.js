document.addEventListener('DOMContentLoaded', () => {

    const scene = new THREE.Scene();
    const container = document.getElementById('scene-container');
    const loadingScreen = document.getElementById('loading-screen');
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Pencahayaan Mewah
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, -5, -5).normalize();
    scene.add(directionalLight2);
    
    let phoneModel;
    let loader = new THREE.ObjectLoader();

    // Memuat model 3D handphone (ganti dengan path model Anda)
    // Model 3D harus dalam format .json, .obj, .gltf, atau lainnya.
    // Anda bisa mendapatkan model 3D gratis dari situs seperti Sketchfab atau TurboSquid.
    // Contoh ini menggunakan format .json. Jika Anda menggunakan format lain (seperti .gltf),
    // Anda harus mengimpor library loader yang sesuai (misal GLTFLoader.js).
    loader.load(
        'https://storage.googleapis.com/a1aa/models/phone_model.json', // Ganti dengan path model handphone Anda
        function (object) {
            phoneModel = object;
            scene.add(phoneModel);
            phoneModel.scale.set(0.5, 0.5, 0.5); // Sesuaikan skala
            
            // Animasi GSAP saat model dimuat
            gsap.from(phoneModel.rotation, { 
                y: Math.PI * 4, 
                duration: 2, 
                ease: "power2.out" 
            });

            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                }
            });
        },
        function (xhr) {
            // Tampilkan progress loading
            const percent = Math.round(xhr.loaded / xhr.total * 100);
            document.querySelector('#loading-screen h1').innerText = `Memuat Handphone 3D... ${percent}%`;
        },
        function (error) {
            console.error('Terjadi kesalahan saat memuat model 3D', error);
            document.querySelector('#loading-screen h1').innerText = 'Gagal memuat model.';
        }
    );

    // Animasi putaran otomatis dan interaksi mouse
    let mouse = new THREE.Vector2();
    let isDragging = false;
    let rotationSpeed = 0.005;

    function onMouseMove(event) {
        if (!phoneModel) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        gsap.to(phoneModel.rotation, {
            y: mouse.x * Math.PI,
            x: mouse.y * Math.PI / 4,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    animate();
});