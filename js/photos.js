const photosElement = document.getElementById('photos-text');
const body = document.body;

photosElement.addEventListener('mouseenter', async () => {
  body.classList.add('fade');
  body.classList.add('fade-in');
  await loadContent();
});

const loadContent = async () => {
  try {
    const response = await fetch('photo-video-gallery.html');
    const data = await response.text();
    document.body.innerHTML = data;

    const script = document.createElement('script');
    script.src = '/js/gallery.js';
    script.type = 'module';
    script.onload = () => console.log("Three.js script loaded successfully");
    document.body.appendChild(script);
  } catch (error) {
    console.error('Error loading the HTML content:', error);
  }
};
