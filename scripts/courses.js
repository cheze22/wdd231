

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming.',
        technology: ['HTML', 'CSS'],
        completed: false
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions.',
        technology: ['Python'],
        completed: false
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];


function createCourseCard(course) {
    const techBadges = course.technology.map(tech => 
        `<span class="tech-badge">${tech}</span>`
    ).join('');
    
    const completedClass = course.completed ? 'completed' : '';
    const completedBadge = course.completed ? '<span class="completed-badge">✓ Completed</span>' : '';
    
    return `
        <div class="course-card ${completedClass}" data-subject="${course.subject}">
            <div class="course-header">
                <h3>${course.subject} ${course.number}</h3>
                ${completedBadge}
            </div>
            <h4>${course.title}</h4>
            <p class="course-description">${course.description}</p>
            
            <div class="course-info">
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p><strong>Certificate:</strong> ${course.certificate}</p>
            </div>
            
            <div class="course-tech">
                <strong>Technology:</strong>
                ${techBadges}
            </div>
            
            <button class="btn btn-toggle" onclick="toggleComplete('${course.subject}', ${course.number})">
                ${course.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
        </div>
    `;
}


function displayCourses(coursesToShow) {
    const container = document.getElementById('courseCards');
    
    if (!container) {
        console.error('Container #courseCards not found');
        return;
    }
    
    if (coursesToShow.length === 0) {
        container.innerHTML = '<p class="no-courses">No courses found.</p>';
        return;
    }
    
    container.innerHTML = coursesToShow.map(course => createCourseCard(course)).join('');
    updateTotalCredits(coursesToShow);
}

function updateTotalCredits(coursesToShow) {
    const totalElement = document.getElementById('totalCredits');
    if (totalElement) {
        const total = coursesToShow.reduce((sum, course) => sum + course.credits, 0);
        totalElement.textContent = total;
    }
}

function filterCourses(filter) {
    let filtered;
    
    if (filter === 'all') {
        filtered = courses;
    } else {
        filtered = courses.filter(course => course.subject === filter);
    }
    
    displayCourses(filtered);
}

function toggleComplete(subject, number) {
    const course = courses.find(c => c.subject === subject && c.number === number);
    
    if (course) {
        course.completed = !course.completed;
        
        // Guardar en localStorage
        localStorage.setItem('courses', JSON.stringify(courses));
        
        // Actualizar display
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilter ? activeFilter.dataset.filter : 'all';
        filterCourses(currentFilter);
    }
}

function loadCoursesFromStorage() {
    const saved = localStorage.getItem('courses');
    
    if (saved) {
        try {
            const savedCourses = JSON.parse(saved);
            savedCourses.forEach(savedCourse => {
                const course = courses.find(c => 
                    c.subject === savedCourse.subject && c.number === savedCourse.number
                );
                if (course) {
                    course.completed = savedCourse.completed;
                }
            });
        } catch (error) {
            console.error('Error loading courses from storage:', error);
        }
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover active de todos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active al clickeado
            this.classList.add('active');
            
            // Filtrar cursos
            const filter = this.dataset.filter;
            filterCourses(filter);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Courses.js loaded');
    loadCoursesFromStorage();
    setupFilters();
    displayCourses(courses);
});