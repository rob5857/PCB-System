function showWorkshopInfo(title, instructor, room, description) {
    alert(`📚 ${title}\n\n👨‍🏫 Instructor: ${instructor}\n🏫 Sala: ${room}\n\n📖 Descripción: ${description}`);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Assignments functionality
async function loadAssignments() {
    const assignmentsList = document.getElementById('assignmentsList');
    assignmentsList.innerHTML = '';
    try {
        const response = await fetch('/api/assignments');
        const assignments = await response.json();
        assignments.forEach(assignment => {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';
            assignmentItem.textContent = assignment.content;
            assignmentsList.appendChild(assignmentItem);
        });
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

function addAssignment() {
    const input = document.getElementById('assignmentInput');
    const content = input.value.trim();
    if (!content) {
        alert('Por favor, escribe una tarea');
        return;
    }
    fetch('/api/assignments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(() => {
        input.value = '';
        loadAssignments();
    })
    .catch(error => {
        console.error('Error adding assignment:', error);
        alert('Error al agregar la tarea');
    });
}

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Mensaje enviado! (Esta es una demostración)');
    this.reset();
});

// Events functionality
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

async function addEvent(title, date, description) {
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, date, description })
        });
        const newEvent = await response.json();
        return newEvent;
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`/api/events/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}

// Report functionality
function submitReport(event) {
    event.preventDefault();
    const title = document.getElementById('reportTitle').value.trim();
    const location = document.getElementById('reportLocation').value.trim();
    const date = document.getElementById('reportDate').value.trim();
    const category = document.getElementById('reportCategory').value;
    const priority = document.getElementById('reportPriority').value;
    const description = document.getElementById('reportDescription').value.trim();

    if (!title || !location || !date || !category || !priority || !description) {
        alert('Por favor, completa todos los campos del reporte');
        return;
    }

    // Collect photos if any
    const photos = [];
    const photoElements = document.querySelectorAll('#capturedPhotos img');
    photoElements.forEach(img => {
        photos.push(img.src);
    });

    fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, location, date, category, priority, description, photos })
    })
    .then(response => response.json())
    .then(() => {
        alert('Reporte enviado exitosamente');
        document.getElementById('reportTitle').value = '';
        document.getElementById('reportLocation').value = '';
        document.getElementById('reportDate').value = '';
        document.getElementById('reportCategory').value = '';
        document.getElementById('reportPriority').value = '';
        document.getElementById('reportDescription').value = '';
        document.getElementById('capturedPhotos').innerHTML = '';
    })
    .catch(error => {
        console.error('Error submitting report:', error);
        alert('Error al enviar el reporte');
    });
}

// Add photo from camera or file input
function addPhoto(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container';
            photoContainer.style.position = 'relative';
            photoContainer.style.display = 'inline-block';
            photoContainer.style.margin = '10px';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.border = '2px solid #2980b9';
            img.style.borderRadius = '8px';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-photo-button';
            deleteButton.innerHTML = '×';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '5px';
            deleteButton.style.right = '5px';
            deleteButton.style.backgroundColor = '#e74c3c';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '25px';
            deleteButton.style.height = '25px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.display = 'flex';
            deleteButton.style.alignItems = 'center';
            deleteButton.style.justifyContent = 'center';
            deleteButton.style.fontSize = '18px';
            deleteButton.style.fontWeight = 'bold';
            deleteButton.title = 'Eliminar foto';

            deleteButton.addEventListener('click', function() {
                photoContainer.remove();
            });

            photoContainer.appendChild(img);
            photoContainer.appendChild(deleteButton);
            document.getElementById('capturedPhotos').appendChild(photoContainer);
        };
        reader.readAsDataURL(file);
    }
}

// Dropdown functionality
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('show');
}

let currentLanguage = 'es'; // Default to Spanish

function selectOption(option) {
    if (option === 'Ajustes') {
        window.location.href = 'ajustes.html';
    } else if (option === 'Idioma') {
        selectLanguage();
    } else {
        alert(`Seleccionaste: ${option}`);
    }
    toggleDropdown(); // Close the dropdown after selection
}

function selectLanguage() {
    const language = prompt('Selecciona el idioma:\n1. Español (es)\n2. English (en)\n\nIngresa "es" o "en":');
    if (language === 'es' || language === 'en') {
        currentLanguage = language;
        updateLanguage();
    } else if (language !== null) {
        alert('Idioma no válido. Usa "es" para Español o "en" para English.');
    }
}

function updateLanguage() {
    const translations = {
        es: {
            'hero-title': 'Bienvenido a la Superior Pablo Colon Berdecia',
            'hero-subtitle': 'Tu plataforma educativa para gestionar clases, tareas y horarios',
            'hero-button1': 'Ver Clases',
            'hero-button2': 'Contactanos',
            'about-title': 'Sobre Nuestra Escuela',
            'news-title': 'Noticias y Anuncios',
            'offerings-title': 'Ofrecimentos Académicos',
            'classes-title': 'Nuestros Talleres',
            'assignments-title': 'Eventos Pendientes',
            'quick-links-title': 'Enlaces Rápidos',
            'contact-title': 'Contactos de Escuela',
            'footer-text': '© 2025 Pablo Colon Berdecia. Todos los derechos reservados.'
        },
        en: {
            'hero-title': 'Welcome to Superior Pablo Colon Berdecia',
            'hero-subtitle': 'Your educational platform to manage classes, assignments, and schedules',
            'hero-button1': 'View Classes',
            'hero-button2': 'Contact Us',
            'about-title': 'About Our School',
            'news-title': 'News and Announcements',
            'offerings-title': 'Academic Offerings',
            'classes-title': 'Our Workshops',
            'assignments-title': 'Pending Events',
            'quick-links-title': 'Quick Links',
            'contact-title': 'School Contacts',
            'footer-text': '© 2025 Pablo Colon Berdecia. All rights reserved.'
        }
    };

    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = translations[currentLanguage]['hero-title'];

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = translations[currentLanguage]['hero-subtitle'];

    const heroButtons = document.querySelectorAll('.hero-buttons .cta-button');
    if (heroButtons.length >= 2) {
        heroButtons[0].textContent = translations[currentLanguage]['hero-button1'];
        heroButtons[1].textContent = translations[currentLanguage]['hero-button2'];
    }

    // Update section titles
    const sections = [
        { selector: '.about-section h2', key: 'about-title' },
        { selector: '.news-section h2', key: 'news-title' },
        { selector: '.offerings-section h2', key: 'offerings-title' },
        { selector: '.classes-section h2', key: 'classes-title' },
        { selector: '.assignments-section h2', key: 'assignments-title' },
        { selector: '.quick-links-section h2', key: 'quick-links-title' },
        { selector: '.contact-section h2', key: 'contact-title' }
    ];

    sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) element.textContent = translations[currentLanguage][section.key];
    });

    // Update footer
    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = translations[currentLanguage]['footer-text'];

    alert(`Idioma cambiado a ${currentLanguage === 'es' ? 'Español' : 'English'}`);
}

// Close dropdown when clicking outside
window.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown.contains(event.target)) {
        const dropdownContent = document.getElementById('dropdown-menu');
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAssignments();

    // Add smooth scrolling to nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            } else if (href.includes('#')) {
                // For links like index.html#section, let the browser handle navigation
                // No preventDefault, so it will navigate to the page and scroll
            } else {
                // For other links, let the browser handle
            }
        });
    });
});
