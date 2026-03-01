/**
<<<<<<< HEAD
 * db.js  –  Firebase Realtime Database + Firebase Storage
 * =========================================================
 * Supports multiple images per project (up to 6).
 *
 * Data structure in Realtime Database:
 *   /projects/{pushId}
 *       type        : "graphic" | "web"
 *       title       : string
 *       category    : string       (graphic only)
 *       description : string
 *       image       : string       (primary image URL – first uploaded)
 *       images      : string[]     (all image URLs)
 *       storagePath : string       (primary storage path)
 *       storagePaths: string[]     (all storage paths – used for deletion)
 *       url         : string       (web only – live URL)
 *       tech        : string       (web only – tech stack)
 *       createdAt   : number       (Unix ms timestamp)
 *
 * Admin password is kept in localStorage only.
 */

const DB = {

    /* ── Local-only keys ── */
    _PASS_KEY: 'pbm_admin_pass',
    DEFAULT_PASSWORD: 'pixelmaliya2025',

    /* ── Lazy Firebase references ── */
    get _db() { return firebase.database(); },
    get _storage() { return firebase.storage(); },
    get _ref() { return this._db.ref('projects'); },

    /* ================================================================
       PROJECTS
       ================================================================ */

    /**
     * Fetch all projects from Realtime Database, sorted newest-first.
     * @returns {Promise<Array>}
     */
    async getProjects() {
        try {
            const snapshot = await this._ref.get();
            if (!snapshot.exists()) return [];
            const projects = [];
            snapshot.forEach(child => {
                const val = child.val();
                // Normalise: ensure `images` array always exists
                if (!val.images) val.images = val.image ? [val.image] : [];
                if (!val.storagePaths) val.storagePaths = val.storagePath ? [val.storagePath] : [];
                projects.push({ id: child.key, ...val });
            });
            return projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } catch (err) {
            console.error('DB.getProjects error:', err);
=======
 * db.js - Local Storage Database for Pixel by Maliya Portfolio
 * Handles all data persistence using localStorage
 */

const DB = {
    KEYS: {
        PROJECTS: 'pbm_projects',
        PASSWORD: 'pbm_admin_pass',
    },

    // Default admin password
    DEFAULT_PASSWORD: 'pixelmaliya2025',

    /**
     * Get all projects from localStorage
     */
    getProjects() {
        try {
            const raw = localStorage.getItem(this.KEYS.PROJECTS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('DB.getProjects error:', e);
>>>>>>> 0d2cda54da2819b2bee4d3b7c1df109ce4750464
            return [];
        }
    },

    /**
<<<<<<< HEAD
     * Upload 1–6 images to Firebase Storage, then save metadata to RTDB.
     *
     * @param {Object}   projectData  - title, type, category, description, url, tech
     * @param {File[]}   imageFiles   - array of File objects (1–6)
     * @param {function} onProgress   - optional callback(overallPercent 0-100)
     * @returns {Promise<Object>}      saved project with id + images array
     */
    async saveProject(projectData, imageFiles, onProgress) {
        try {
            const images = [];
            const storagePaths = [];
            const total = imageFiles.length;

            for (let i = 0; i < total; i++) {
                const file = imageFiles[i];
                const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
                const path = `projects/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
                const ref = this._storage.ref(path);

                // Upload with per-file progress
                const task = ref.put(file);
                if (onProgress) {
                    task.on('state_changed', snap => {
                        const fileProgress = snap.bytesTransferred / snap.totalBytes;
                        const overallPct = Math.round(((i + fileProgress) / total) * 100);
                        onProgress(overallPct);
                    });
                }
                await task;
                const url = await ref.getDownloadURL();
                images.push(url);
                storagePaths.push(path);

                if (onProgress) onProgress(Math.round(((i + 1) / total) * 100));
            }

            const project = {
                ...projectData,
                image: images[0],       // primary (used by portfolio cards)
                images,                        // full array
                storagePath: storagePaths[0], // primary (backward compat)
                storagePaths,                  // full array (used for deletion)
                createdAt: Date.now(),
            };

            const newRef = await this._ref.push(project);
            return { id: newRef.key, ...project };

        } catch (err) {
            console.error('DB.saveProject error:', err);
            throw err;
        }
    },

    /**
     * Delete a project from RTDB and all its images from Storage.
     * @param {string}          id           - Firebase RTDB push key
     * @param {string|string[]} storagePaths - single path or array of paths
     * @returns {Promise<void>}
     */
    async deleteProject(id, storagePaths) {
        try {
            await this._ref.child(id).remove();
            const paths = Array.isArray(storagePaths)
                ? storagePaths
                : (storagePaths ? [storagePaths] : []);
            for (const p of paths) {
                try { await this._storage.ref(p).delete(); }
                catch (e) { console.warn('Storage delete skipped:', e.message); }
            }
        } catch (err) {
            console.error('DB.deleteProject error:', err);
            throw err;
        }
    },

    /* ================================================================
       ADMIN PASSWORD  –  localStorage only
       ================================================================ */
    getPassword() { return localStorage.getItem(this._PASS_KEY) || this.DEFAULT_PASSWORD; },
    setPassword(p) { localStorage.setItem(this._PASS_KEY, p); },
    checkPassword(input) { return input === this.getPassword(); },

=======
     * Save a new project
     */
    saveProject(project) {
        const projects = this.getProjects();
        project.id = Date.now().toString();
        project.createdAt = new Date().toISOString();
        projects.unshift(project); // newest first
        localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
        return project;
    },

    /**
     * Delete a project by ID
     */
    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
    },

    /**
     * Get the admin password
     */
    getPassword() {
        return localStorage.getItem(this.KEYS.PASSWORD) || this.DEFAULT_PASSWORD;
    },

    /**
     * Set a new admin password
     */
    setPassword(newPass) {
        localStorage.setItem(this.KEYS.PASSWORD, newPass);
    },

    /**
     * Check if password matches
     */
    checkPassword(input) {
        return input === this.getPassword();
    }
>>>>>>> 0d2cda54da2819b2bee4d3b7c1df109ce4750464
};
