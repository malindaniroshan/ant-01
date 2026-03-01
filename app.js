/**
 * app.js - Main Application Logic for Pixel by Maliya Portfolio
 */

/* ==================== STATE ==================== */
let currentMainTab = 'graphic';      // 'graphic' | 'web'
let currentCategory = 'all';         // 'all' | 'logo' | 'visiting-card' | 'thankyou-card' | 'printing'
let currentAdminTab = 'graphic';     // admin side tab
let isAdminLoggedIn = false;

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorEffect();
    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    animateStats();
    renderPortfolio();
});

/* ==================== NAVBAR ==================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

/* ==================== STATS ANIMATION ==================== */
function animateStats() {
    const target = 50; // "50+" projects done
    const el = document.getElementById('stat-projects');
    if (!el) return;
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(timer);
            el.textContent = count + '+';
        } else {
            el.textContent = count + '+';
        }
    }, 40);
}

/* ==================== REVEAL ON SCROLL ==================== */
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/* ==================== PORTFOLIO TABS ==================== */
function switchMainTab(tab) {
    currentMainTab = tab;

    // Update tab buttons
    document.querySelectorAll('.main-tab').forEach(btn => {
        btn.classList.remove('active-main-tab');
        btn.classList.add('text-gray-400', 'hover:text-white');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    activeBtn.classList.add('active-main-tab');
    activeBtn.classList.remove('text-gray-400', 'hover:text-white');

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('content-' + tab).classList.remove('hidden');

    renderPortfolio();
}

/* ==================== CATEGORY FILTER ==================== */
function filterCategory(cat) {
    currentCategory = cat;

    document.querySelectorAll('.cat-filter').forEach(btn => {
        btn.classList.remove('active-cat-filter');
        btn.classList.add('inactive-cat-filter');
    });
    const activeBtn = document.querySelector(`[data-cat="${cat}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active-cat-filter');
        activeBtn.classList.remove('inactive-cat-filter');
    }

    renderPortfolio();
}

/* ==================== RENDER PORTFOLIO ==================== */
async function renderPortfolio() {
    const allProjects = await DB.getProjects();

    if (currentMainTab === 'graphic') {
        renderGraphicGrid(allProjects.filter(p => p.type === 'graphic'));
    } else {
        renderWebGrid(allProjects.filter(p => p.type === 'web'));
    }
}

function renderGraphicGrid(projects) {
    const grid = document.getElementById('graphicGrid');
    const empty = document.getElementById('graphicEmpty');

    const filtered = currentCategory === 'all'
        ? projects
        : projects.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = filtered.map(p => createGraphicCard(p)).join('');
}

function renderWebGrid(projects) {
    const grid = document.getElementById('webGrid');
    const empty = document.getElementById('webEmpty');

    if (projects.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createWebCard(p)).join('');
}

function createGraphicCard(project) {
    const catLabels = {
        'logo': 'Logo Design',
        'visiting-card': 'Visiting Card',
        'thankyou-card': 'Thank You Card',
        'printing': 'Printing Work',
        'social-media': 'Social Media',
        'banner': 'Banner',
        'tshirt': 'T-Shirt',
    };
    const catColors = {
        'logo': 'brand',
        'visiting-card': 'accent',
        'thankyou-card': 'pink',
        'printing': 'amber',
        'social-media': 'green',
        'banner': 'orange',
        'tshirt': 'purple',
    };
    const color = catColors[project.category] || 'brand';
    const label = catLabels[project.category] || project.category;

    return `
    <div class="portfolio-card group relative rounded-2xl overflow-hidden bg-dark-700/60 border border-white/10 hover:border-brand-500/40 shadow-lg cursor-pointer"
         onclick="openLightbox('${escapeHtml(project.image)}', '${escapeHtml(project.title)}')">
        <div class="overflow-hidden aspect-[4/3]">
            <img src="${escapeHtml(project.image)}" 
                 alt="${escapeHtml(project.title)}" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%231f2937%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 fill=%22%236b7280%22 text-anchor=%22middle%22 font-size=%2216%22>Image not found</text></svg>'" />
        </div>
        <div class="p-4">
            <span class="inline-block px-2 py-1 rounded-lg bg-${color}-500/10 text-${color}-300 text-xs font-medium border border-${color}-500/20 mb-2">${label}</span>
            <h3 class="font-display font-bold text-white text-sm leading-tight">${escapeHtml(project.title)}</h3>
            ${project.description ? `<p class="text-gray-500 text-xs mt-1 line-clamp-2">${escapeHtml(project.description)}</p>` : ''}
        </div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <i class="fas fa-search-plus text-white text-xl"></i>
            </div>
        </div>
    </div>`;
}

function createWebCard(project) {
    const techList = project.tech ? project.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

    return `
    <div class="portfolio-card group rounded-2xl overflow-hidden bg-dark-700/60 border border-white/10 hover:border-purple-500/40 shadow-lg">
        <div class="overflow-hidden aspect-video cursor-pointer" 
             onclick="openLightbox('${escapeHtml(project.image)}', '${escapeHtml(project.title)}')">
            <img src="${escapeHtml(project.image)}" 
                 alt="${escapeHtml(project.title)}" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%231f2937%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%236b7280%22 text-anchor=%22middle%22 font-size=%2216%22>Image not found</text></svg>'" />
        </div>
        <div class="p-5">
            <h3 class="font-display font-bold text-white text-lg mb-2">${escapeHtml(project.title)}</h3>
            ${project.description ? `<p class="text-gray-400 text-sm mb-4 leading-relaxed">${escapeHtml(project.description)}</p>` : ''}
            ${techList.length > 0 ? `
            <div class="flex flex-wrap gap-2 mb-4">
                ${techList.map(t => `<span class="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">${escapeHtml(t)}</span>`).join('')}
            </div>` : ''}
            ${project.url ? `
            <a href="${escapeHtml(project.url)}" target="_blank" 
               class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 border border-purple-500/30 transition-all">
                <i class="fas fa-external-link-alt text-xs"></i> View Live
            </a>` : ''}
        </div>
    </div>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ==================== LIGHTBOX ==================== */
function openLightbox(src, alt) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    img.alt = alt || '';
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

/* ==================== ADMIN PANEL ==================== */
function openAdminPanel() {
    const overlay = document.getElementById('adminOverlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (isAdminLoggedIn) {
        showAdminContent();
    } else {
        document.getElementById('adminLoginSection').classList.remove('hidden');
        document.getElementById('adminContent').classList.add('hidden');
        // Focus password input
        setTimeout(() => {
            document.getElementById('adminPasswordInput').focus();
        }, 100);
    }
}

function closeAdminPanel() {
    const overlay = document.getElementById('adminOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
}

// Close admin panel when clicking outside
document.getElementById('adminOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeAdminPanel();
});

// Press Enter to login
document.getElementById('adminPasswordInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkAdminPassword();
});

function checkAdminPassword() {
    const input = document.getElementById('adminPasswordInput').value;
    const error = document.getElementById('adminLoginError');

    if (DB.checkPassword(input)) {
        isAdminLoggedIn = true;
        error.classList.add('hidden');
        document.getElementById('adminPasswordInput').value = '';
        showAdminContent();
    } else {
        error.classList.remove('hidden');
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminPasswordInput').focus();
        // Shake animation
        const input = document.getElementById('adminPasswordInput');
        input.style.animation = 'none';
        input.style.borderColor = 'rgba(239,68,68,0.7)';
        setTimeout(() => { input.style.borderColor = ''; }, 1000);
    }
}

function showAdminContent() {
    document.getElementById('adminLoginSection').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
    renderAdminProjectsList();
}

function changeAdminPassword() {
    const newPass = document.getElementById('newPasswordInput').value.trim();
    if (!newPass || newPass.length < 4) {
        showToast('Password must be at least 4 characters!', 'error');
        return;
    }
    DB.setPassword(newPass);
    document.getElementById('newPasswordInput').value = '';
    showToast('✅ Password changed successfully!', 'success');
}

function adminTab(tab) {
    currentAdminTab = tab;

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active-admin-tab');
        btn.classList.add('inactive-admin-tab');
    });
    document.getElementById('adminTab' + (tab === 'graphic' ? 'Graphic' : 'Web')).classList.add('active-admin-tab');
    document.getElementById('adminTab' + (tab === 'graphic' ? 'Graphic' : 'Web')).classList.remove('inactive-admin-tab');

    // Show/hide category and web-specific fields
    if (tab === 'graphic') {
        document.getElementById('adminCatField').classList.remove('hidden');
        document.getElementById('webSpecificFields').classList.add('hidden');
    } else {
        document.getElementById('adminCatField').classList.add('hidden');
        document.getElementById('webSpecificFields').classList.remove('hidden');
    }

    renderAdminProjectsList();
}

/* ==================== IMAGE UPLOAD ==================== */
let uploadedImageData = null;

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        showToast('Image is too large! Max 10MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedImageData = e.target.result;
        document.getElementById('imagePreview').src = uploadedImageData;
        document.getElementById('imagePreviewContainer').classList.remove('hidden');
        document.getElementById('imageDropZone').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function clearImagePreview() {
    uploadedImageData = null;
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreviewContainer').classList.add('hidden');
    document.getElementById('imageDropZone').classList.remove('hidden');
    document.getElementById('projImage').value = '';
}

// Drag & drop support
document.getElementById('imageDropZone').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-brand-500/70', 'bg-brand-500/10');
});
document.getElementById('imageDropZone').addEventListener('dragleave', (e) => {
    e.currentTarget.classList.remove('border-brand-500/70', 'bg-brand-500/10');
});
document.getElementById('imageDropZone').addEventListener('drop', (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-brand-500/70', 'bg-brand-500/10');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const input = document.getElementById('projImage');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        previewImage({ target: input });
    }
});

/* ==================== SAVE PROJECT ==================== */
function saveProject() {
    const title = document.getElementById('projTitle').value.trim();
    const description = document.getElementById('projDescription').value.trim();

    if (!title) {
        showToast('Please enter a project title!', 'error');
        document.getElementById('projTitle').focus();
        return;
    }
    if (!uploadedImageData) {
        showToast('Please upload a project image!', 'error');
        return;
    }

    const project = {
        type: currentAdminTab,
        title,
        description,
        image: uploadedImageData,
    };

    if (currentAdminTab === 'graphic') {
        project.category = document.getElementById('projCategory').value;
    } else {
        project.url = document.getElementById('projUrl').value.trim();
        project.tech = document.getElementById('projTech').value.trim();
    }

    DB.saveProject(project);

    // Reset form
    document.getElementById('projTitle').value = '';
    document.getElementById('projDescription').value = '';
    document.getElementById('projUrl') && (document.getElementById('projUrl').value = '');
    document.getElementById('projTech') && (document.getElementById('projTech').value = '');
    clearImagePreview();

    showToast('✅ Project saved successfully!', 'success');
    renderAdminProjectsList();
    renderPortfolio();
}

/* ==================== ADMIN PROJECTS LIST ==================== */
function renderAdminProjectsList() {
    const container = document.getElementById('adminProjectsList');
    const allProjects = DB.getProjects();
    const filtered = allProjects.filter(p => p.type === currentAdminTab);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm text-center py-6">No ${currentAdminTab} projects yet.</p>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-white/5 hover:border-white/10 transition-all group">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" 
             class="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-white/10" 
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22><rect fill=%22%231f2937%22 width=%2256%22 height=%2256%22/></svg>'" />
        <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">${escapeHtml(p.title)}</p>
            <p class="text-gray-500 text-xs">${p.category || p.type || ''}</p>
        </div>
        <button onclick="deleteProject('${p.id}')" 
                class="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 hover:border-red-500/50 flex items-center justify-center text-red-400 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
            <i class="fas fa-trash text-xs"></i>
        </button>
    </div>`).join('');
}

function deleteProject(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    DB.deleteProject(id);
    showToast('🗑️ Project deleted.', 'success');
    renderAdminProjectsList();
    renderPortfolio();
}

/* ==================== CONTACT FORM ==================== */
function sendWhatsAppMessage(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const service = document.getElementById('contactService').value;
    const message = document.getElementById('contactMessage').value.trim();

    const text = `Hi Pixel by Maliya! 👋\n\nMy name is *${name}*.\n\nI'm interested in: *${service}*\n\nMessage: ${message}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/94716125715?text=${encoded}`, '_blank');
}

/* ==================== TOAST NOTIFICATION ==================== */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==================== PARTICLE BACKGROUND ==================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.5 ? '99,102,241' : '6,182,212',
        };
    }

    for (let i = 0; i < 80; i++) particles.push(createParticle());

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
            ctx.fill();

            // Draw connecting lines
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const dist = Math.hypot(p.x - other.x, p.y - other.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/* ==================== CURSOR EFFECT ==================== */
function initCursorEffect() {
    const canvas = document.getElementById('cursorAnimCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let mouse = { x: -200, y: -200 };
    let trail = [];

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        trail.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (trail.length > 20) trail.shift();
    });

    function drawCursor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        trail.forEach((point, i) => {
            point.age++;
            const alpha = Math.max(0, 0.5 - point.age * 0.05) * (i / trail.length);
            const size = Math.max(0, 3 - point.age * 0.1) * (i / trail.length);

            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99,102,241,${alpha})`;
            ctx.fill();
        });

        trail = trail.filter(p => p.age < 12);
        requestAnimationFrame(drawCursor);
    }
    drawCursor();
}
