// Elements
const lessonList = document.getElementById('lessonList');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const lessonImage = document.getElementById('lessonImage');
const mindmapTitle = document.getElementById('mindmapTitle');
const mindmapContainer = document.getElementById('mindmapContainer');
const title = document.getElementById('lessonTitle');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const resetZoom = document.getElementById('resetZoom');

// Storage
let lastLessonIndex = localStorage.getItem('lastLessonIndex');

// Lesson data (easy to extend)
const lessons = [
  { type: 'mindmap', title: 'Sinh trưởng vi sinh vật', idx: 1, image: '../img/sinh-truong-vi-sinh-vat.png' },
  { type: 'mindmap', title: 'Sinh sản vi sinh vật', idx: 2, image: '../img/sinh-san-vsv.png' }
  // Add more here...
];

let currentScale = 1;

// Render lesson list
function renderLessons(filter = '') {
  lessonList.innerHTML = '';
  lessons.filter(item => item.title.toLowerCase().includes(filter.toLowerCase())).forEach((item, i) => {
    const div = document.createElement('div');
    div.classList.add('lesson');
    div.dataset.id = i;
    const titleSpan = document.createElement('span');
    titleSpan.textContent = item.title;
    div.appendChild(titleSpan);
    div.onclick = () => {
      selectLesson(i);
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    };
    lessonList.appendChild(div);
  });
}

// Select lesson
let currentLesson = null;

function selectLesson(i) {
  if (i < 0 || i >= lessons.length) return;
  currentLesson = i;
  title.textContent = lessons[i].title;
  mindmapTitle.textContent = lessons[i].title;
  document.querySelectorAll('.lesson').forEach(el => el.classList.remove('active'));
  const selected = lessonList.querySelector(`.lesson:nth-child(${i+1})`);
  if (selected) selected.classList.add('active');

  // Set image src with loading effect
  lessonImage.classList.remove('loaded');
  lessonImage.src = lessons[i].image;
  lessonImage.onload = () => {
    lessonImage.classList.add('loaded');
  };
  currentScale = 1;
  applyZoom();

  localStorage.setItem('lastLessonIndex', currentLesson);
}

// Apply zoom
function applyZoom() {
  lessonImage.style.transform = `scale(${currentScale})`;
}

// Zoom controls
zoomIn.onclick = () => {
  currentScale += 0.1;
  applyZoom();
};

zoomOut.onclick = () => {
  if (currentScale > 0.5) {
    currentScale -= 0.1;
    applyZoom();
  }
};

resetZoom.onclick = () => {
  currentScale = 1;
  applyZoom();
};

// Modal zoom on click
mindmapContainer.onclick = () => {
  modal.style.display = "block";
  modalImage.src = lessonImage.src;
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Menu toggle
menuToggle.onclick = () => {
  sidebar.classList.toggle('open');
  menuToggle.classList.toggle('active');
};

// Search functionality
searchInput.addEventListener('input', (e) => {
  renderLessons(e.target.value);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && currentLesson < lessons.length - 1) {
    selectLesson(currentLesson + 1);
  } else if (e.key === 'ArrowLeft' && currentLesson > 0) {
    selectLesson(currentLesson - 1);
  } else if (e.key === '/' && document.activeElement !== searchInput) {
    searchInput.focus();
    e.preventDefault();
  }
});

// Initial render
renderLessons();

// Restore last selected lesson
if (lastLessonIndex !== null) {
  const idx = Number(lastLessonIndex);
  if (!isNaN(idx) && idx >= 0 && idx < lessons.length) {
    setTimeout(() => selectLesson(idx), 100);
  }
} else {
  setTimeout(() => selectLesson(0), 100);
}

// Save last lesson on page leave
window.addEventListener('beforeunload', () => {
  if (currentLesson !== null) localStorage.setItem('lastLessonIndex', currentLesson);
});