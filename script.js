// Elements
const lessonList = document.getElementById('lessonList');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const lessonImage = document.getElementById('lessonImage');
const mindmapTitle = document.getElementById('mindmapTitle');
const mindmapContainer = document.getElementById('mindmapContainer');
const title = document.getElementById('lessonTitle');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

// Storage
let lastLessonIndex = localStorage.getItem('lastLessonIndex');

// Lesson data (easy to extend)
const lessons = [
  { type: 'mindmap', title: 'Sinh trưởng vi sinh vật', idx: 1, image: 'img/sinh-truong-vi-sinh-vat.png' },
  { type: 'mindmap', title: 'Sinh sản vi sinh vật', idx: 2, image: 'img/sinh-san-vsv.png' },
  { type: 'mindmap', title: 'Khái quát vi sinh vật', idx: 3, image: 'img/sdtd-khai-quat-vsv.png' },
  { type: 'mindmap', title: 'Dinh dưỡng vi sinh vật', idx: 4, image: 'img/sdtd-dinh-duong-vsv.png' },
  { type: 'mindmap', title: 'Khái quát sinh học thực vật', idx: 5, image: 'img/sdtd-khai-quat-sinh-hoc-thuc-vat.png' },
  { type: 'mindmap', title: 'Cấu tạo vi sinh vật', idx: 6, image: 'img/sdtd-cau-tao-vsv.png' },
  { type: 'mindmap', title: 'Quang hợp và trao đổi khí ở thực vật', idx: 7, image: 'img/sdtd-quang-hop-va-trao-doi-khi-o-thuc-vat.png' },
  { type: 'mindmap', title: 'Nghiên cứu khả năng lọc không khí của các loài cây xanh phổ biên', idx: 8, image: 'img/sdtd-nghien-cuu-kha-nang-loc-khong-khi-cua-cac-loai-cay-xanh-pho-bien-trong-cay-trong.png' },
  { type: 'mindmap', title: 'Sinh sản ở thực vật', idx: 9, image: 'img/sdtd-sinh-san-o-thuc-vat.png' },
  { type: 'mindmap', title: 'Đột biến sinh học', idx: 10, image: 'img/sdtd-dot-bien-sinh-hoc.png' },
  { type: 'mindmap', title: 'Ba định luật Mendel', idx: 11, image: 'img/sdtd-mendel.png' },
  { type: 'mindmap', title: 'Khái quát di truyền học', idx: 12, image: 'img/sdtd-khai-quat-di-truyen-học.png' },
  { type: 'mindmap', title: 'Phiên mã dịch mã', idx: 13, image: 'img/sđtd-Phien-ma-va-Dich-ma.png' }





  // Add more here...
];

let currentScale = 1;
const minScale = 0.5;
const maxScale = 3;
const scaleStep = 0.1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Render lesson list
function renderLessons() {
  lessonList.innerHTML = '';
  lessons.forEach((item, i) => {
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
  const selected = lessonList.querySelector(`.lesson:nth-child(${i + 1})`);
  if (selected) selected.classList.add('active');

  // Set image src with loading effect
  lessonImage.classList.remove('loaded');
  lessonImage.src = lessons[i].image;
  lessonImage.onload = () => {
    lessonImage.classList.add('loaded');
  };
  currentScale = 1;
  translateX = 0;
  translateY = 0;
  applyZoom();
}

// Apply zoom to main image
function applyZoom() {
  lessonImage.style.transform = `scale(${currentScale})`;
  lessonImage.style.transition = 'transform 0.3s ease';
}

// Apply zoom and pan to modal image
function applyModalZoom() {
  modalImage.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
  modalImage.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
}

// Scroll zoom in modal
modal.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0 && currentScale < maxScale) {
    // Scroll up to zoom in
    currentScale += scaleStep;
  } else if (e.deltaY > 0 && currentScale > minScale) {
    // Scroll down to zoom out
    currentScale -= scaleStep;
  }
  applyModalZoom();
});

// Panning in modal
modalImage.addEventListener('mousedown', (e) => {
  if (currentScale > 1) { // Only allow panning when zoomed in
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    modalImage.style.cursor = 'grabbing';
  }
});

modalImage.addEventListener('mousemove', (e) => {
  if (isDragging) {
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyModalZoom();
  }
});

modalImage.addEventListener('mouseup', () => {
  isDragging = false;
  modalImage.style.cursor = 'move';
});

modalImage.addEventListener('mouseleave', () => {
  isDragging = false;
  modalImage.style.cursor = 'move';
});

// Modal zoom on click
mindmapContainer.onclick = (e) => {
  modal.style.display = 'block';
  modalImage.src = lessonImage.src;
  currentScale = 1;
  translateX = 0;
  translateY = 0;
  applyModalZoom();
};

closeModal.onclick = () => {
  modal.style.display = 'none';
  isDragging = false;
  modalImage.style.cursor = 'move';
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
    isDragging = false;
    modalImage.style.cursor = 'move';
  }
};

// Menu toggle
menuToggle.onclick = () => {
  sidebar.classList.toggle('open');
  menuToggle.classList.toggle('active');
};

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

// Tìm kiếm trong sidebar
document.getElementById('searchInput')?.addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase().trim();
  const lessons = document.querySelectorAll('.lesson');

  lessons.forEach(lesson => {
    const text = lesson.textContent.toLowerCase();
    if (text.includes(query)) {
      lesson.style.display = 'flex';
    } else {
      lesson.style.display = 'none';
    }
  });
});
